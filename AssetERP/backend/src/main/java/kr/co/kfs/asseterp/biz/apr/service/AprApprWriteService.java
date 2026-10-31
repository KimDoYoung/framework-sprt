package kr.co.kfs.asseterp.biz.apr.service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprBrief;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveStepReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprFileDelRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeStep;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprActionMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprWriteMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 전자결재 상신·임시저장 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc.save·updateChk·update → server/apr/Apr01_Appr.update L383-832, deleteByApprId L1017-1070, V03).
 * AS-IS는 상태·등록자·회사·결재 처리자를 클라이언트가 보낸 값 그대로 믿고 저장했다 → TOBE는 로그인 사원 기준으로 서버가 다시 정한다.
 * 이 ID(V03)가 다루는 것은 문서 본체와 결재선뿐이다. 연관펀드·일임·문서·법규·내규·첨부·날인신청 저장은 V05에서 같은 트랜잭션에 더한다.
 * 알림은 AprNoticeService가 정하고 커밋 뒤 보낸다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprApprWriteService {

    private final AprApprWriteMapper mapper;
    private final AprApprActionMapper actionMapper;
    private final AprNoticeService notice;

    /** 새 문서 번호 (AS-IS insertApproval의 DBUtil.setSeq) */
    @Transactional
    public Long nextApprId() {
        return mapper.selectNextId();
    }

    /** [저장]·[결재요청] — 문서가 아직 없으면 새로 넣고, 있으면 고친다(UpdateDataModel의 신규/변경 판정) */
    @Transactional
    public AprApprWriteRes save(UserPrincipal user, Long apprId, AprApprSaveReq req) {
        boolean request = "request".equals(req.mode());
        Long companyId = user.getCompanyId();
        Long me = user.getUserId();

        AprApprBrief old = mapper.selectBrief(apprId, companyId);
        if (old != null && (!me.equals(old.regEmpId()) || !"99".equals(old.statusCode()))) {
            return fail("임시저장 문서만 상신자가 수정할 수 있습니다.");
        }
        if (old == null && req.classTreeId() == null) {
            return fail("문서분류가 없습니다.");
        }
        String message = request ? checkRequest(req) : checkSave(req);
        if (message != null) {
            return fail(message);
        }
        List<AprApprSaveStepReq> steps = sortedSteps(req.steps());
        if (steps.isEmpty()) {
            return fail("결재선이 없습니다.");
        }
        // apprStepLockChk01: 결재·합의가 하나도 없으면 한 번 묻고 이어 간다 (checkStepLine, 인감(40)은 세지 않는다)
        if (request && !req.confirmed() && steps.stream().noneMatch(s -> "10".equals(s.stepTypeCode()) || "20".equals(s.stepTypeCode()))) {
            return new AprApprWriteRes(false, "결재선에 상신자 외 결재권자가 없습니다. 계속 진행하시겠습니까?", apprId, null, false, "confirm");
        }

        // updateChk L4905-4923: 결재·합의·인감이 있으면 상신(10), 없으면 바로 완료(30)
        String statusCode = "99";
        if (request) {
            statusCode = steps.stream().anyMatch(s -> "10".equals(s.stepTypeCode()) || "20".equals(s.stepTypeCode()) || "40".equals(s.stepTypeCode()))
                    ? "10" : "30";
        }
        Long regEmpId = old != null ? old.regEmpId() : me;
        LocalDateTime regDate = req.regDate();
        Long stampId = req.stampId() != null && req.stampId() == 0 ? null : req.stampId();
        boolean outDoc = "10".equals(req.inOutTypeCode());

        // Apr01_Appr.update L390-392: 대외문서면 문서번호 식별단어를 구한다
        String dcrIdWord = outDoc ? mapper.selectDcrIdWord(companyId, regEmpId, regDate) : null;
        // L402-412: 바로 완료면 인감이 있는 대외문서에 인감대장번호
        String stampSeq = null;
        if ("30".equals(statusCode) && outDoc && stampId != null) {
            stampSeq = actionMapper.selectStampSeq(apprId, companyId, regEmpId, regDate);
        }
        AprApprSaveReq saved = Objects.equals(stampId, req.stampId()) ? req : withStampId(req, stampId);
        if (old == null) {
            mapper.insertAppr(apprId, companyId, regEmpId, statusCode, dcrIdWord, stampSeq, saved);
        } else {
            mapper.updateAppr(apprId, companyId, statusCode, dcrIdWord, stampSeq, saved);
        }

        // L520-546: 결재선은 지우고 다시 넣는다. 상신(00) 단계는 결재서명이 하나 있으면 그 서명을 붙인다
        mapper.deleteStepsByApprId(apprId);
        List<AprNoticeStep> noticeSteps = new ArrayList<>();
        for (int i = 0; i < steps.size(); i++) {
            AprApprSaveStepReq s = steps.get(i);
            String type = s.stepTypeCode();
            String stepStatus;
            LocalDateTime apprDate = null;
            Long apprEmpId = null;
            String note = null;
            if (request) {
                // update L4963-4987
                if ("00".equals(type)) {
                    stepStatus = "20";
                    apprDate = LocalDateTime.now();
                    apprEmpId = me;
                    note = req.message();
                } else if ("30".equals(type)) {
                    stepStatus = null;
                } else {
                    stepStatus = "10";
                }
            } else {
                // save L5105-5118: 첫 단계는 대기, 결재·합의도 대기, 나머지는 받은 값 그대로
                stepStatus = i == 0 || "10".equals(type) || "20".equals(type) ? "10" : s.stepStatusCode();
            }
            Long signId = "00".equals(type) ? mapper.selectSignId(s.stepEmpId()) : null;
            Long apprStepId = s.apprStepId() != null ? s.apprStepId() : mapper.selectNextId();
            mapper.insertStep(apprStepId, apprId, type, s.seq(), stepStatus, s.stepEmpId(), apprEmpId, apprDate, note, s.lockYn(), s.addEmpId(), signId);
            noticeSteps.add(new AprNoticeStep(apprId, s.seq(), type, stepStatus, s.stepEmpId(), apprDate));
        }

        // L646-660: 바로 완료된 광고심사 문서는 광고대장에 한 줄
        if ("30".equals(statusCode)) {
            Long classTreeId = old != null ? old.classTreeId() : req.classTreeId();
            String advertYn = old != null ? old.advertYn() : mapper.selectAdvertYn(classTreeId);
            if ("true".equals(advertYn)) {
                actionMapper.insertAdvertHistory(actionMapper.selectAdvertSeq(), apprId, companyId);
            }
        }

        // 알림 (L417-519 참조자 / L664-826 다음 결재자) — 결재요청일 때만, 커밋 뒤에 보낸다
        if (request) {
            Long classTreeId = old != null ? old.classTreeId() : req.classTreeId();
            notice.dispatchAfterCommit(notice.planAfterRequest(companyId, classTreeId, req.title(), user.getName(), statusCode, noticeSteps));
        }
        // 바로 완료(30)의 대외문서는 AS-IS가 PDF를 만들었다(makepdf) — 미리보기 PDF와 함께 V04에서 연결한다
        return new AprApprWriteRes(true, null, apprId, statusCode, false, null);
    }

    /**
     * [삭제] — deleteChk01 L1275-1300 → apr.Apr01_Appr.deleteByApprId 임시저장 가지(L1023-1045): 완료되지 않은 날인신청과 연관펀드·결재선을 지우고 문서를 지운다.
     * 첨부파일은 sys10_file 행과 실제 파일을 함께 지운다(V10).
     */
    @Transactional
    public AprApprWriteRes delete(UserPrincipal user, Long apprId) {
        AprApprBrief doc = mapper.selectBrief(apprId, user.getCompanyId());
        if (doc == null) {
            return fail("문서를 찾을 수 없습니다.");
        }
        if (!user.getUserId().equals(doc.regEmpId()) || !"99".equals(doc.statusCode())) {
            return fail("임시저장 문서만 상신자가 삭제할 수 있습니다.");
        }
        String notice = actionMapper.countStampDocsDone(apprId) > 0
                ? "완료된 법인서류 및 인감날인 신청건이 존재합니다. 완료된 신청내역은 자동 삭제되지 않습니다." : null;
        actionMapper.deleteStampDocs(apprId);
        mapper.deleteRelateFundsByApprId(apprId);
        // sys10_file: 실제 파일도 함께 지운다(실패해도 로그만 — AS-IS L1030-1042)
        for (AprFileDelRow f : mapper.selectFilesForDelete(apprId)) {
            File file = new File(f.serverPath(), String.valueOf(f.fileId()));
            log.info("임시저장 문서 첨부 삭제 fileId={} {}", f.fileId(), file.delete() ? "성공" : "실패");
        }
        mapper.deleteFilesByParentId(apprId);
        mapper.deleteStepsByApprId(apprId);
        actionMapper.deleteAppr(apprId);
        actionMapper.clearOprApprId(apprId);
        actionMapper.clearPlanApprId(apprId);
        actionMapper.deleteAdvertByApprId(apprId);
        return new AprApprWriteRes(true, null, apprId, null, false, notice);
    }

    // ───────────────────────── 입력 검사 (AS-IS 메시지 그대로) ─────────────────────────

    /** save() L5007-5058 */
    private static String checkSave(AprApprSaveReq r) {
        boolean out = "10".equals(r.inOutTypeCode());
        if (out && isBlank(r.signCompany())) {
            return "대외문서에 대표회사는 필수입력항목입니다.";
        }
        if (isBlank(r.title())) {
            return "제목은 반드시 입력하셔야 합니다";
        }
        if (r.title().length() > 200) {
            return "상신제목의 글자수가 초과하였습니다";
        }
        if (r.effectDate() == null) {
            return "시행일은 필수입력 항목입니다";
        }
        if (r.regDate() == null) {
            return "상신일은 필수입력 항목입니다";
        }
        if (isBlank(r.content())) {
            return "내용은 필수입력 항목입니다";
        }
        if (out) {
            if (r.stampId() == null || r.stampId() == 0) {
                return "대외문서는 인감선택이 필수입니다";
            }
            if (isBlank(r.receiveName())) {
                return "수신자는 필수입력 항목입니다";
            }
        }
        return null;
    }

    /** beforePDFChk L4443-4447 → updateChk L4837-4847 → preCheck L5389-5437 (연관법규/내규 마감일 검사는 연관 설정을 만드는 V05) */
    private static String checkRequest(AprApprSaveReq r) {
        if ("10".equals(r.inOutTypeCode())) {
            if (isBlank(r.signCompany())) {
                return "대외문서에 대표회사는 필수입력항목입니다.";
            }
        } else if (r.stampId() != null && r.stampId() != 0) {
            return "사내문서는 인감사용이 불가능합니다.";
        }
        if (isBlank(r.title())) {
            return "상신제목은 필수입력 항목입니다";
        }
        if (r.title().length() > 200) {
            return "상신제목의 글자수가 초과하였습니다";
        }
        if (r.effectDate() == null) {
            return "시행일은 필수입력 항목입니다";
        }
        if (r.regDate() == null) {
            return "상신일은 필수입력 항목입니다";
        }
        if (isBlank(r.content())) {
            return "내용은 필수입력 항목입니다";
        }
        return null;
    }

    private static boolean isBlank(String s) {
        return s == null || s.isEmpty();
    }

    private static List<AprApprSaveStepReq> sortedSteps(List<AprApprSaveStepReq> steps) {
        if (steps == null) {
            return List.of();
        }
        List<AprApprSaveStepReq> out = new ArrayList<>(steps);
        out.sort(Comparator.comparingInt(s -> Integer.parseInt(s.seq())));
        return out;
    }

    private static AprApprSaveReq withStampId(AprApprSaveReq r, Long stampId) {
        return new AprApprSaveReq(r.mode(), r.classTreeId(), r.linkCode(), r.title(), r.content(), r.note(), r.effectDate(), r.regDate(), stampId,
                r.receiveName(), r.referenceName(), r.inOutTypeCode(), r.signCompany(), r.signCeo(), r.stampPosition(), r.formType(),
                r.message(), r.confirmed(), r.steps());
    }

    private static AprApprWriteRes fail(String message) {
        return new AprApprWriteRes(false, message, null, null, false, null);
    }
}
