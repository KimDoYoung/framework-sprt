package kr.co.kfs.asseterp.biz.apr.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.apr.dto.AprAltRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeCall;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticePerson;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeStep;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprDetailMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprNoticeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import lombok.RequiredArgsConstructor;

/**
 * 결재·폐기·휴가취소·사업비 알림 대상 정하기 (AS-IS server/apr/Apr04_ApprStep.confirmUpdate·clearApprStepId·updateList, Apr01_Appr.update,
 * Apr90_DisposalList.modelUpdate, Emp20_Leave.cancelUpdate, Pay50_Expense.confirm/rejectSendMessage, AA01).
 * 두 단계: ① plan*() — DB를 읽어 "누구에게" 정하고 사람마다 {@link AlertService#plan}으로 "무엇을" 정한다(쓰기 없음, 테스트 대상)
 * ② dispatchAfterCommit() — SMS 발송 기록을 남기고 커밋 뒤 보낸다(롤백이면 안 보냄).
 * 원본 98d5afdd6(2026-11-11, CH-0249·0256·0260·0261·0285·0312)부터 문구·발송 조건은 통합알림(AlertService) 하나로 모였다.
 * 코드: 20 다음 결재자 · 30 결재완료 · 40 반려 · 50 이전 결재자 승인취소. 수신설정 코드: T011 상신문서(결재순서) · T012 상신문서(결재완료).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprNoticeService {

    private final AprNoticeMapper mapper;
    private final AprApprDetailMapper detailMapper;
    private final AlertService alert;

    // ───────────────────────── 계획 ─────────────────────────

    /** [승인]·[반려] 뒤 (confirmUpdate L508-653) — docStatus: 20 결재중 · 30 완료 · 40 반려. 회사는 문서의 회사 */
    public List<AprNoticeCall> planAfterConfirm(UserPrincipal user, AprApprDetailRes doc, String docStatus) {
        List<AprNoticeCall> out = new ArrayList<>();
        Long apprId = doc.apprId();
        Long companyId = doc.companyId();
        List<AprNoticeStep> steps = mapper.selectSteps(apprId);

        if ("30".equals(docStatus) || "40".equals(docStatus)) {
            // L512-545: 결재완료/반려 — 마지막 결재자와 참조자를 뺀, 결재한 사람(상신자 포함)에게
            Long lastOne = mapper.selectLastStepEmp(apprId);
            String code = "30".equals(docStatus) ? "30" : "40";
            for (AprNoticeStep m : steps) {
                if (Objects.equals(lastOne, m.stepEmpId())) {
                    continue;
                }
                if (!"30".equals(m.stepTypeCode()) && m.apprDate() != null && person(m.stepEmpId()) != null) {
                    out.addAll(alert.plan("T012", m.stepEmpId(), companyId, params(apprId, code)));
                }
            }
            if ("30".equals(docStatus)) {
                // L547-567: 결재완료면 참조자에게
                for (AprNoticeStep m : steps) {
                    if ("30".equals(m.stepTypeCode()) && person(m.stepEmpId()) != null) {
                        out.addAll(alert.plan("T012", m.stepEmpId(), companyId, params(apprId, "30")));
                    }
                }
            }
        } else {
            // L568-653: 결재중 — 다음 결재자에게
            planNext(out, steps, mapper.selectLastCheck(apprId), mapper.selectNextCheck(apprId), companyId, "20");
        }
        return out;
    }

    /**
     * [결재요청] 뒤 — apr.Apr01_Appr.update(V03). 바로 결재완료(30)면 참조자에게 "상신과 동시에 결재완료"(L423-448, code 99 — 문서가 아직 없어
     * 분류명·제목을 넘긴다), 아니면 L600-638: 첫 결재·합의·인감 단계의 사원에게 "다음 결재자"(대결자가 아니라 단계 담당자 본인). 합의가 이어지면 다음 합의까지, 결재가 나오면 멈춘다
     */
    public List<AprNoticeCall> planAfterRequest(Long companyId, Long apprId, Long classTreeId, String title, String docStatus, List<AprNoticeStep> steps) {
        List<AprNoticeCall> out = new ArrayList<>();
        if ("30".equals(docStatus)) {
            String classTreeName = mapper.selectClassTreeName(classTreeId);
            for (AprNoticeStep m : steps) {
                if ("30".equals(m.stepTypeCode()) && person(m.stepEmpId()) != null) {
                    Map<String, Object> p = new HashMap<>();
                    p.put("classTreeName", classTreeName);
                    p.put("titleName", title);
                    p.put("code", "99");
                    out.addAll(alert.plan("T012", m.stepEmpId(), companyId, p));
                }
            }
            return out;
        }
        boolean send = false;
        for (AprNoticeStep m : steps) {
            String type = m.stepTypeCode();
            if (!("10".equals(type) || "20".equals(type) || "40".equals(type))) {
                continue;
            }
            if (send && "10".equals(type)) {
                break;
            }
            if (person(m.stepEmpId()) != null) {
                out.addAll(alert.plan("T011", m.stepEmpId(), companyId, params(apprId, "20")));
            }
            if ("20".equals(type)) {
                send = true;
                continue;
            }
            break;
        }
        return out;
    }

    /** 결재선 수정 [저장] 뒤 — apr.Apr04_ApprStep.updateList L1744-1769(V08): 처음으로 대기(10)인 결재·합의 단계의 사원 한 명에게 "다음 결재자". 회사는 문서의 회사 */
    public List<AprNoticeCall> planAfterRetouch(Long companyId, List<AprNoticeStep> steps) {
        List<AprNoticeCall> out = new ArrayList<>();
        for (AprNoticeStep m : steps) {
            if (("10".equals(m.stepTypeCode()) || "20".equals(m.stepTypeCode())) && "10".equals(m.stepStatusCode())) {
                if (person(m.stepEmpId()) != null) {
                    out.addAll(alert.plan("T011", m.stepEmpId(), companyId, params(m.apprId(), "20")));
                }
                break;
            }
        }
        return out;
    }

    /** [승인취소] 전 — clearApprStepId L660-740: 취소 직전 상태에서 아직 대기인 단계의 결재자에게 "직전 결재자의 승인 취소"(code 50). 회사는 받는 사람의 회사 */
    public List<AprNoticeCall> planBeforeCancelApproval(UserPrincipal user, AprApprDetailRes doc) {
        List<AprNoticeCall> out = new ArrayList<>();
        List<AprNoticeStep> next = mapper.selectNextCheck(doc.apprId());
        planNext(out, next, mapper.selectLastCheck(doc.apprId()), next, null, "50");
        return out;
    }

    /** 다음 결재자 찾기 (confirmUpdate L577-650 / clearApprStepId L668-740 — 같은 규칙). companyId가 null이면 받는 사람의 회사 */
    private void planNext(List<AprNoticeCall> out, List<AprNoticeStep> source, List<AprNoticeStep> lastList, List<AprNoticeStep> nextList,
                          Long companyId, String code) {
        boolean send = false;
        int e = 0;
        for (AprNoticeStep m : source) {
            String type = m.stepTypeCode();
            if (!(("10".equals(type) || "20".equals(type) || "40".equals(type)) && "10".equals(m.stepStatusCode()))) {
                continue;
            }
            // 받을 사람: 인감은 인감 대결자가 있으면 (부)책임자, 결재·합의는 대결자가 있으면 대결자, 아니면 단계 담당자
            AprNoticePerson target;
            if ("40".equals(type)) {
                List<Long> alt = mapper.selectStampAltSecondEmp(m.apprId(), m.stepEmpId());
                target = alt.size() == 1 ? person(alt.get(0)) : person(m.stepEmpId());
            } else {
                AprAltRow alt = detailMapper.selectAltByEmp(m.stepEmpId());
                target = alt != null ? person(alt.altEmpId()) : person(m.stepEmpId());
            }
            // #.1-2: 직전 결재자가 합의이고 다음 대기자도 합의면 알리지 않고 끝낸다 / 이미 합의 연속 발송 중에 결재가 나오면 끝낸다
            if (send && "10".equals(type)) {
                break;
            }
            if (!lastList.isEmpty() && !nextList.isEmpty()
                    && "20".equals(lastList.get(0).stepTypeCode()) && "20".equals(nextList.get(0).stepTypeCode())) {
                break;
            }
            if (target != null) {
                out.addAll(alert.plan("T011", target.personId(), companyId != null ? companyId : target.companyId(), params(m.apprId(), code)));
            }
            // #.1-3: 직전이 결재(10)이고 다음 대기자가 합의(20)면 합의가 끝날 때까지 이어서 알린다
            if (!lastList.isEmpty() && !nextList.isEmpty()) {
                if ("10".equals(lastList.get(0).stepTypeCode()) && nextList.size() > e && "20".equals(nextList.get(e).stepTypeCode())) {
                    e++;
                    send = true;
                    continue;
                }
                break;
            }
        }
    }

    /** [문서폐기 신청] 뒤 — apr.Apr90_DisposalList.modelUpdate L132-141: 승인자에게 T013 "'제목' 문서폐기 신청이 도착했습니다…" */
    public List<AprNoticeCall> planDisposalRequest(Long companyId, Long confirmEmpId, Long apprId) {
        if (person(confirmEmpId) == null) {
            return new ArrayList<>();
        }
        return new ArrayList<>(alert.plan("T013", confirmEmpId, companyId, params(apprId, null)));
    }

    /** [휴가취소] 전 — emp.Emp20_Leave.cancelUpdate L141-156: 결재선의 모든 사람(상신자 포함)에게 T02 "[Asset-ERP] 제목 취소되었습니다." 회사는 받는 사람의 회사. 결재문서를 지우기 전에 불러야 한다 */
    public List<AprNoticeCall> planLeaveCancel(Long companyId, Long apprId) {
        List<AprNoticeCall> out = new ArrayList<>();
        for (AprNoticeStep s : mapper.selectSteps(apprId)) {
            AprNoticePerson p = person(s.stepEmpId());
            if (p != null) {
                out.addAll(alert.plan("T02", p.personId(), p.companyId(), params(apprId, null)));
            }
        }
        return out;
    }

    /** [반려건 일괄 알림발송] — pay.Pay50_Expense.confirmSendMessage L704-727: 요청자 한 사람에게 A02 "사업비요청 N건이 반려되었습니다". 사원이 없으면 빈 목록 */
    public List<AprNoticeCall> planExpenseReject(Long companyId, Long regEmpId, String count) {
        AprNoticePerson p = person(regEmpId);
        if (p == null) {
            return new ArrayList<>();
        }
        Map<String, Object> m = new HashMap<>();
        m.put("count", count);
        return new ArrayList<>(alert.plan("A02", p.personId(), p.companyId(), m));
    }

    /**
     * 지출결의서(경영관리) #1385 [반려건 일괄 알림발송] — pay.Pay50_Expense.rejectSendMessage L738-761: 받는 사람 한 명에게 A03.
     * 원본 그대로: 건수를 "count()" 키로 넘겨(오타) 통합알림이 건수를 못 읽는다 → 문구가 "지출결의 null건이 반려되었습니다"(원본-이상한점)
     */
    public List<AprNoticeCall> planExpenseRejectByManager(Long companyId, Long empId, String count) {
        AprNoticePerson p = person(empId);
        if (p == null) {
            return new ArrayList<>();
        }
        Map<String, Object> m = new HashMap<>();
        m.put("count()", count);
        return new ArrayList<>(alert.plan("A03", p.personId(), p.companyId(), m));
    }

    /** 알림을 받을 사원이 있는지 (AS-IS emp01_person.selectById 결과가 있을 때만 알림) */
    public boolean personExists(Long personId) {
        return person(personId) != null;
    }

    private AprNoticePerson person(Long personId) {
        return personId == null ? null : mapper.selectPerson(personId);
    }

    private static Map<String, Object> params(Long apprId, String code) {
        Map<String, Object> p = new HashMap<>();
        p.put("apprId", apprId);
        if (code != null) {
            p.put("code", code);
        }
        return p;
    }

    // ───────────────────────── 보내기 ─────────────────────────

    /** SMS 발송 기록(AlertService ①)을 부른 쪽 트랜잭션에 남기고, 커밋 뒤에 보낸다 */
    @Transactional
    public void dispatchAfterCommit(List<AprNoticeCall> calls) {
        alert.record(null, calls, null);
        alert.dispatchAfterCommit(calls);
    }
}
