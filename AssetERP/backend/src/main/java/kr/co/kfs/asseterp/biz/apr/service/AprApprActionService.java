package kr.co.kfs.asseterp.biz.apr.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprActionRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprActionStateRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprLastStepRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprStepStateRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprActionMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;

/**
 * 전자결재 결재 처리 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc 승인·반려·승인취소·상신취소 + server/apr/Apr04_ApprStep confirmUpdate·clearApprStepId·cancelUpdate, V02).
 * AS-IS는 단추를 켤지(myTurnCheck 등)를 클라이언트가 정하고 서버는 값을 믿고 고쳤다 → TOBE는 같은 판정을 서버에서 다시 해 로그인 사원이 할 수 없는 처리는 막는다.
 * 알림(앱·메일·SMS 발송, Apr04_ApprStep의 SendTalkAPI·SendMailMaster·sendSMSToNextApprStep)은 TOBE에 발송 부품이 없어 만들지 않았다(작업기록).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprActionService {

    private final AprApprDetailService detail;
    private final AprApprActionMapper mapper;

    /** retrieveApproval 판정의 결과 (내부용) */
    record Turn(boolean canConfirm, AprApprStepRes myStep, boolean canCancelApproval, boolean canCancelRequest) {
        static final Turn NONE = new Turn(false, null, false, false);
    }

    /** 열린 문서에서 켤 단추 */
    public AprApprActionStateRes getState(UserPrincipal user, Long apprId) {
        AprApprDetailRes doc = detail.getDetail(user, apprId);
        Turn t = turn(user, doc, detail.getSteps(user, apprId));
        return new AprApprActionStateRes(t.canConfirm(), t.canCancelApproval(), t.canCancelRequest());
    }

    /** [승인]·[반려]를 누르면 결재의견 창을 열기 전에 먼저 하는 확인 — apr.Apr04_ApprStep.confirmCheck (L1134-1145, 1193-1196) */
    public AprApprActionRes confirmCheck(UserPrincipal user, Long apprId) {
        AprApprDetailRes doc = detail.getDetail(user, apprId);
        Turn t = turn(user, doc, detail.getSteps(user, apprId));
        if (!t.canConfirm()) {
            return fail("결재할 수 있는 문서가 아닙니다.");
        }
        if (!"Y".equals(mapper.confirmCheck(apprId, t.myStep().stepTypeCode(), t.myStep().seq()))) {
            return fail("이전 결재권자의 결재가 취소되어 결재를 진행할 수 없습니다.");
        }
        return new AprApprActionRes(true, false, false, null, null);
    }

    /** [승인]·[반려] — confirmCheck L1133-1199 → Apr01_Edit_NoteMessage/RejectMessage → apr.Apr04_ApprStep.confirmUpdate */
    @Transactional
    public AprApprActionRes confirm(UserPrincipal user, Long apprId, String action, String message) {
        AprApprDetailRes doc = detail.getDetail(user, apprId);
        Turn t = turn(user, doc, detail.getSteps(user, apprId));
        if (!t.canConfirm()) {
            return fail("결재할 수 있는 문서가 아닙니다.");
        }
        AprApprStepRes my = t.myStep();
        Long me = user.getUserId();
        // myTurnCheck L1081-1085: 대결이면 원결재자, 아니면 본인
        Long stepEmpId = !Objects.equals(my.stepEmpId(), my.apprEmpId()) ? my.stepEmpId() : me;
        if (!"Y".equals(mapper.confirmCheck(apprId, my.stepTypeCode(), my.seq()))) {
            return fail("이전 결재권자의 결재가 취소되어 결재를 진행할 수 없습니다.");
        }
        boolean approve = "confirm".equals(action);
        String statusCode = approve ? "20" : "30";
        String note = approve ? message : null;
        String rejectReason = approve ? null : (message == null || message.isEmpty() ? "반려사유 미입력" : message);
        mapper.confirmUpdateStep(apprId, stepEmpId, my.stepTypeCode(), my.seq(), statusCode, note, rejectReason, me);

        // confirmUpdate L20-61: 뒤 단계의 실제 결재자가 본인이면 이어서 같이 승인한다 (합의는 다른 사람이 끼면 거기서 멈춘다)
        if (approve) {
            boolean pass = true;
            for (AprLastStepRow last : mapper.selectLastSteps(apprId, my.seq())) {
                if ("20".equals(last.stepTypeCode())) {
                    if (Objects.equals(last.stepEmpId(), me)) {
                        mapper.nextConfirmUpdate(apprId, last.seq(), "20", note, null, me);
                    } else {
                        pass = false;
                    }
                } else if (pass && Objects.equals(last.stepEmpId(), me)) {
                    mapper.nextConfirmUpdate(apprId, last.seq(), "20", note, null, me);
                } else {
                    break;
                }
            }
        }

        // L65-83: 문서 상태 — 결재·합의·인감에 대기(10)가 있으면 결재중(20), 반려(30)가 있으면 반려(40), 아니면 완료(30)
        String docStatus = "30";
        for (AprStepStateRow s : mapper.selectStepStates(apprId)) {
            if ("10".equals(s.stepTypeCode()) || "20".equals(s.stepTypeCode()) || "40".equals(s.stepTypeCode())) {
                if ("10".equals(s.stepStatusCode())) {
                    docStatus = "20";
                } else if ("30".equals(s.stepStatusCode())) {
                    docStatus = "40";
                    break;
                }
            }
        }
        boolean hasStamp = doc.stampId() != null && doc.stampId() != 0;
        String stampSeq = null;
        if ("30".equals(docStatus) && hasStamp) {
            stampSeq = mapper.selectStampSeq(apprId, user.getCompanyId(), doc.regEmpId(), doc.regDate());
        }
        mapper.confirmUpdateAppr(apprId, docStatus, stampSeq);
        if ("30".equals(docStatus) && "true".equals(doc.advertYn())) {
            mapper.insertAdvertHistory(mapper.selectAdvertSeq(), apprId, user.getCompanyId());
        }
        boolean makePdf = "30".equals(docStatus) && hasStamp && stampSeq != null;
        return new AprApprActionRes(true, false, makePdf, null, null);
    }

    /** [승인취소] — makeCancelApprovalButton L730-788 → nextTurnCheck → cancleApprStep L790-813 (clearApprStepId) */
    @Transactional
    public AprApprActionRes cancelApproval(UserPrincipal user, Long apprId) {
        AprApprDetailRes doc = detail.getDetail(user, apprId);
        List<AprApprStepRes> steps = detail.getSteps(user, apprId);
        if (!turn(user, doc, steps).canCancelApproval()) {
            return fail("승인을 취소할 수 없는 문서입니다.");
        }
        // L740-748: seq 내림차순으로 훑으며 원결재자(stepEmpId)가 본인인 단계를 덮어써 가장 앞 단계가 남는다
        List<AprApprStepRes> desc = new ArrayList<>(steps);
        desc.sort((a, b) -> seqOf(b) - seqOf(a));
        AprApprStepRes mine = null;
        for (AprApprStepRes s : desc) {
            if (Objects.equals(user.getUserId(), s.stepEmpId())) {
                mine = s;
            }
        }
        if (mine == null) {
            return fail("결재정보를 찾을 수 없습니다. 관리자에게 문의해주세요");
        }
        if (!"Y".equals(mapper.nextTurnCheck(apprId, mine.stepTypeCode(), mine.seq()))) {
            return fail("다음 결재권자의 결재가 진행되어 결재를 취소할 수 없습니다.");
        }
        mapper.clearApprStep(mine.apprStepId());
        return new AprApprActionRes(true, false, false, null, null);
    }

    /** [상신취소] — cancelCheck01 L1207-1222 → cancelCheck02 → cancel/cancel2 (apr.Apr92_ApprModi.deleteByApprId, apr.Apr04_ApprStep.cancelUpdate) 또는 특정 화면 상신 문서는 deleteChk01 */
    @Transactional
    public AprApprActionRes cancelRequest(UserPrincipal user, Long apprId, boolean confirmed) {
        AprApprDetailRes doc = detail.getDetail(user, apprId);
        if (!turn(user, doc, detail.getSteps(user, apprId)).canCancelRequest()) {
            return fail("상신취소할 수 없는 문서입니다.");
        }
        if (mapper.countDoneSteps(apprId) > 1) {
            return fail("결재중인 문서는 상신취소가 불가능합니다");
        }
        if (doc.linkCode() != null) {
            if (!confirmed) {
                return new AprApprActionRes(false, true, false, "특정 화면에서 상신된 문서로, 상신취소 시 즉시 폐기됩니다. 진행하시겠습니까?", null);
            }
            // deleteChk01 L1275-1300: 완료된 날인신청이 있으면 알리고, 안 끝난 신청을 지운 뒤 문서를 지운다
            String notice = mapper.countStampDocsDone(apprId) > 0
                    ? "완료된 법인서류 및 인감날인 신청건이 존재합니다. 완료된 신청내역은 자동 삭제되지 않습니다." : null;
            mapper.deleteStampDocs(apprId);
            AprApprActionRes res = deleteAppr(user, doc);
            return res.ok() ? new AprApprActionRes(true, false, false, null, notice) : res;
        }
        mapper.deleteApprModi(apprId);
        mapper.cancelUpdateStep(apprId, user.getUserId());
        mapper.cancelUpdateAppr(apprId);
        return new AprApprActionRes(true, false, false, null, null);
    }

    /**
     * AS-IS apr.Apr01_Appr.deleteByApprId (server/apr/Apr01_Appr.java L1017-1070) 중 임시저장이 아닌 문서: 폐기문서(apr99)로 옮기고 상신문서를 지운다.
     * 임시저장(99) 문서의 완전 삭제(연관펀드·파일 실물·결재선 삭제)는 [삭제] 단추를 만드는 V04에서 연결한다.
     */
    private AprApprActionRes deleteAppr(UserPrincipal user, AprApprDetailRes doc) {
        Long apprId = doc.apprId();
        if ("99".equals(doc.statusCode())) {
            return fail("임시저장 문서의 삭제는 V04에서 연결합니다.");
        }
        mapper.insertApprDel(apprId, user.getUserId());
        mapper.deleteAppr(apprId);
        mapper.clearOprApprId(apprId);
        mapper.clearPlanApprId(apprId);
        mapper.deleteAdvertByApprId(apprId);
        return new AprApprActionRes(true, false, false, null, null);
    }

    /** retrieveApproval L643-728 + myTurnCheck L1032-1131 + myCancelApprovalCheck L859-1030 */
    private Turn turn(UserPrincipal user, AprApprDetailRes doc, List<AprApprStepRes> steps) {
        Long me = user.getUserId();
        String status = doc.statusCode();
        // 임시저장 본인 문서는 편집 모드(결재 단추 없음, V03)
        if ("99".equals(status) && Objects.equals(me, doc.regEmpId())) {
            return Turn.NONE;
        }
        // 결재선 그리드 store의 get(0)은 상신자(seq 첫 줄)로 쓰인다 (L689-693의 의도). buildApprStepGrid L1605의 결재상태 정렬(StoreSortInfo)이
        // 실제로 먹는지는 AS-IS 화면에서 확인하지 못해, 단추 판정은 seq 순서(서버 조회 순서)로 한다 — 작업방법 "다른 점"
        List<AprApprStepRes> store = new ArrayList<>(steps);

        boolean flag = store.isEmpty() || !Objects.equals(me, store.get(0).stepEmpId());
        for (int i = 1; i < store.size(); i++) {
            if ("20".equals(store.get(i).stepStatusCode())) {
                flag = true;
            }
        }
        if ("40".equals(status) || "30".equals(status)) {
            flag = true;
        }

        boolean cancelApproval = flag && !"30".equals(status) && !"40".equals(status) && myCancelApprovalCheck(status, store, me);
        AprApprStepRes mine = myTurn(status, store, me);
        return new Turn(mine != null, mine, cancelApproval, !flag);
    }

    /** myTurnCheck L1042-1094 — 내 대기(10) 단계 중 앞 단계가 모두 승인된 것, 반려 문서는 없음 */
    private AprApprStepRes myTurn(String docStatus, List<AprApprStepRes> store, Long me) {
        List<AprApprStepRes> candidates = new ArrayList<>();
        for (AprApprStepRes s : store) {
            if (Objects.equals(me, s.apprEmpId()) && "10".equals(s.stepStatusCode())) {
                candidates.add(s);
            }
        }
        candidates.sort(Comparator.comparingInt(AprApprActionService::seqOf));
        AprApprStepRes found = null;
        for (AprApprStepRes c : candidates) {
            int mySeq = seqOf(c);
            boolean blocked = false;
            for (AprApprStepRes s : store) {
                if (seqOf(s) < mySeq) {
                    if ("30".equals(s.stepTypeCode())) {
                        continue;
                    }
                    if ("20".equals(s.stepTypeCode()) && "20".equals(c.stepTypeCode())) {
                        continue;
                    }
                    if (!"20".equals(s.stepStatusCode())) {
                        blocked = true;
                        break;
                    }
                }
            }
            if (!blocked) {
                found = c;
                break;
            }
        }
        return "40".equals(docStatus) ? null : found;
    }

    /** myCancelApprovalCheck L859-1030 — 진행중(20) 문서에서 내가 승인한 단계를 되돌릴 수 있는가 */
    private boolean myCancelApprovalCheck(String docStatus, List<AprApprStepRes> store, Long me) {
        if (!"20".equals(docStatus)) {
            return false;
        }
        List<AprApprStepRes> list = new ArrayList<>(store);
        list.sort(Comparator.comparingInt(AprApprActionService::seqOf));
        int myIdx = -1;
        for (int i = 0; i < list.size(); i++) {
            AprApprStepRes s = list.get(i);
            if (Objects.equals(me, s.apprEmpId()) && "20".equals(s.stepStatusCode())) {
                myIdx = i;
                break;
            }
        }
        if (myIdx < 0) {
            return false;
        }
        AprApprStepRes my = list.get(myIdx);
        if ("20".equals(my.stepTypeCode())) {      // 합의 묶음
            int start = myIdx;
            int end = myIdx;
            while (start > 0 && "20".equals(list.get(start - 1).stepTypeCode())) {
                start--;
            }
            while (end < list.size() - 1 && "20".equals(list.get(end + 1).stepTypeCode())) {
                end++;
            }
            for (int i = start; i <= end; i++) {
                if ("10".equals(list.get(i).stepStatusCode())) {
                    return true;
                }
            }
            for (int i = end + 1; i < list.size(); i++) {
                AprApprStepRes s = list.get(i);
                if ("30".equals(s.stepTypeCode())) {
                    continue;
                }
                if ("20".equals(s.stepStatusCode())) {
                    return false;
                }
                if ("10".equals(s.stepStatusCode())) {
                    return true;
                }
            }
            return true;
        }
        for (int i = myIdx + 1; i < list.size(); i++) {   // 일반 결재: 뒤에 이미 승인된 단계가 있으면 취소 불가
            AprApprStepRes s = list.get(i);
            if ("30".equals(s.stepTypeCode())) {
                continue;
            }
            if ("20".equals(s.stepStatusCode())) {
                return false;
            }
        }
        return true;
    }

    private static int seqOf(AprApprStepRes s) {
        return Integer.parseInt(s.seq());
    }

    private static AprApprActionRes fail(String message) {
        return new AprApprActionRes(false, false, false, message, null);
    }
}
