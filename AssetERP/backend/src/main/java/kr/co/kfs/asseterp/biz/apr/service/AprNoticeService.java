package kr.co.kfs.asseterp.biz.apr.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import kr.co.kfs.asseterp.biz.apr.dto.AprAltRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeCall;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticePerson;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeStep;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprDetailMapper;
import kr.co.kfs.asseterp.biz.apr.mapper.AprNoticeMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.config.properties.NoticeProperties;
import kr.co.kfs.asseterp.common.notice.NoticeResult;
import kr.co.kfs.asseterp.common.notice.NoticeSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 결재 처리 뒤 알림 (AS-IS server/apr/Apr04_ApprStep.confirmUpdate L144-561 · clearApprStepId L960-1131 의 앱알림·메일·SMS 부분, AA01).
 * 두 단계: ① plan*() — DB를 읽어 "누구에게 무엇을" 정한다(쓰기 없음, 테스트 대상) ② dispatchAfterCommit() — 커밋 뒤 NoticeSender로 보낸다(롤백이면 안 보냄).
 * 코드: 20 다음 결재자 · 30 결재완료 · 40 반려 · 50 이전 결재자 승인취소. 수신설정 코드: T011 상신문서(결재순서) · T012 상신문서(결재완료).
 * AS-IS 문구·조건을 그대로 따른다(아래 "원본 그대로" 표시한 곳은 이상해 보여도 원본이 그렇다).
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprNoticeService {

    private static final String FOOTER = "<br/><br/>Asset-ERP 시스템에 접속 후 MyPage 메인화면에서 자세한 내용을 확인부탁드립니다.";

    private final AprNoticeMapper mapper;
    private final AprApprDetailMapper detailMapper;
    private final NoticeProperties props;
    private final NoticeSender sender;

    // ───────────────────────── 계획 ─────────────────────────

    /** [승인]·[반려] 뒤 — docStatus: 20 결재중 · 30 완료 · 40 반려 */
    public List<AprNoticeCall> planAfterConfirm(UserPrincipal user, AprApprDetailRes doc, String docStatus) {
        List<AprNoticeCall> out = new ArrayList<>();
        Long apprId = doc.apprId();
        AprNoticePerson reg = mapper.selectPerson(doc.regEmpId());
        String classTreeName = mapper.selectClassTreeName(doc.classTreeId());
        if (reg == null || classTreeName == null) {
            return out;       // AS-IS: 상신자·분류를 못 찾으면 알림을 멈춘다
        }
        String title = doc.title();
        String loc = mapper.selectCompanyLoc(user.getCompanyId());
        List<AprNoticeStep> steps = mapper.selectSteps(apprId);

        if ("30".equals(docStatus) || "40".equals(docStatus)) {
            // L189-299: 결재완료/반려 — 마지막 결재자와 참조자를 뺀, 결재한 사람(상신자 포함)에게. 휴대폰 번호가 없으면 그 사람은 모든 알림을 건너뛴다(원본 그대로)
            Long lastOne = mapper.selectLastStepEmp(apprId);
            for (AprNoticeStep m : steps) {
                if (Objects.equals(lastOne, m.stepEmpId())) {
                    continue;
                }
                if (!"30".equals(m.stepTypeCode()) && m.apprDate() != null) {
                    AprNoticePerson p = mapper.selectPerson(m.stepEmpId());
                    if (p == null || p.mobileTelNo() == null) {
                        continue;
                    }
                    // 앱알림 문구는 반려(40)여도 "30"(결재완료)으로 보낸다(원본 그대로)
                    plan(out, p, loc, loc, "30".equals(docStatus) ? "30" : "40", "", classTreeName, title, "T012", "30");
                }
            }
            if ("30".equals(docStatus)) {
                // L301-398: 결재완료면 참조자에게 — 번호가 없는 참조자를 만나면 남은 참조자까지 멈춘다(원본 break)
                for (AprNoticeStep m : steps) {
                    if ("30".equals(m.stepTypeCode())) {
                        AprNoticePerson p = mapper.selectPerson(m.stepEmpId());
                        if (p != null) {
                            if (p.mobileTelNo() == null) {
                                break;
                            }
                            plan(out, p, mapper.selectCompanyLoc(p.companyId()), mapper.selectCompanyLoc(doc.companyId()), "30", p.korName(), classTreeName, title, "T012", "30");
                        }
                    }
                }
            }
        } else {
            // L399-561: 결재중 — 다음 결재자에게
            planNext(out, steps, mapper.selectLastCheck(apprId), mapper.selectNextCheck(apprId), loc, "20", reg.korName(), classTreeName, title, "T011");
        }
        return out;
    }

    /** [승인취소] 전 — clearApprStepId L960-1131: 취소 직전 상태에서 아직 대기인 단계의 결재자에게 "직전 결재자의 승인 취소" (code 50) */
    public List<AprNoticeCall> planBeforeCancelApproval(UserPrincipal user, AprApprDetailRes doc) {
        List<AprNoticeCall> out = new ArrayList<>();
        String classTreeName = mapper.selectClassTreeName(doc.classTreeId());
        List<AprNoticeStep> next = mapper.selectNextCheck(doc.apprId());
        planNext(out, next, mapper.selectLastCheck(doc.apprId()), next, mapper.selectCompanyLoc(user.getCompanyId()), "50", user.getName(), classTreeName, doc.title(), "T011");
        return out;
    }

    /** 다음 결재자 찾기 (confirmUpdate L408-560 / clearApprStepId L10-166 — 같은 규칙) */
    private void planNext(List<AprNoticeCall> out, List<AprNoticeStep> source, List<AprNoticeStep> lastList, List<AprNoticeStep> nextList,
                          String loc, String code, String name, String classTreeName, String title, String noticeCode) {
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
                plan(out, target, loc, loc, code, name, classTreeName, title, noticeCode, code);
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

    /** 한 사람에게 갈 알림 — 앱알림(수신설정 확인) · 메일(회사 발송 여부 + 수신설정) · SMS(회사 발송 여부 + 번호 + 수신설정) */
    private void plan(List<AprNoticeCall> out, AprNoticePerson p, String flagLoc, String urlLoc, String code, String name,
                      String classTreeName, String title, String noticeCode, String talkCode) {
        if (p.emailAddress() != null && mapper.countTalkBlocked(p.personId(), noticeCode) == 0) {
            out.add(new AprNoticeCall("talk", p.emailAddress(), "T012".equals(noticeCode) ? "상신문서(결재완료)" : "상신문서(결재순서)", talkMessage(talkCode, classTreeName, title)));
        }
        if (props.mailEnabled(flagLoc) && p.emailAddress() != null && mapper.countMailBlocked(p.personId(), noticeCode) == 0) {
            out.add(new AprNoticeCall("mail", p.emailAddress(), "[알림] Asset-ERP 전자결재", mailHtml(code, classTreeName, title)));
        }
        if (props.smsEnabled(flagLoc) && p.mobileTelNo() != null && mapper.countSmsBlocked(p.personId(), noticeCode) == 0) {
            out.add(new AprNoticeCall("sms", p.mobileTelNo().replace("-", ""), "[Asset-ERP 알림]", smsMessage(code, name, title, urlLoc)));
        }
    }

    private AprNoticePerson person(Long personId) {
        return personId == null ? null : mapper.selectPerson(personId);
    }

    // ───────────────────────── 문구 (AS-IS SendTalkAPI·SendSMSAPIFunction·SendMailMaster) ─────────────────────────

    static String talkMessage(String code, String classTreeName, String title) {
        String head = "결재문서 " + " '(" + classTreeName + ") " + title + "' 건";
        return switch (code) {
            case "20" -> head + "의 다음 결재자입니다.";
            case "30" -> head + "이 결재완료되었습니다.";
            case "40" -> head + "이 반려되었습니다.";
            case "50" -> head + "이 직전 결재자의 승인 취소로 인해 결재가 중단되었습니다.";
            default -> " ";
        };
    }

    static String smsMessage(String code, String name, String title, String loc) {
        String url = "\r\n\r\n https://" + loc + ".k-fs.co.kr:5151/";
        return switch (code) {
            case "20" -> name + "(으)로부터 \r\n" + "'" + title + "'\r\n결재문서가 도착했습니다." + url;
            case "30" -> "'" + title + "'\r\n해당문서가 결재완료되었습니다." + url;
            case "40" -> "'" + title + "'\r\n해당문서가 반려되었습니다." + url;
            case "50" -> "'" + title + "'\r\n해당문서가 직전 결재자의 승인 취소로 인해 결재가 중단되었습니다." + url;
            default -> null;
        };
    }

    static String mailHtml(String code, String classTreeName, String title) {
        String t = talkMessage(code, classTreeName, title);
        return " ".equals(t) ? " " : t + FOOTER;
    }

    // ───────────────────────── 보내기 ─────────────────────────

    /** 커밋된 뒤에 보낸다 — 트랜잭션이 롤백되면 알림도 가지 않는다. 트랜잭션이 없으면 바로 보낸다 */
    public void dispatchAfterCommit(List<AprNoticeCall> calls) {
        if (calls.isEmpty()) {
            return;
        }
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    calls.forEach(c -> send(c));
                }
            });
        } else {
            calls.forEach(this::send);
        }
    }

    /** 한 건 보내기 — 실패는 로그만 (AS-IS도 예외를 삼켰다) */
    NoticeResult send(AprNoticeCall c) {
        NoticeResult r = switch (c.kind()) {
            case "talk" -> sender.sendTalk(c.to(), c.title(), c.body());
            case "sms" -> sender.sendSms(List.of(c.to()), c.body());
            case "mail" -> sender.sendMail(c.to(), c.title(), c.body());
            default -> NoticeResult.fail("알 수 없는 종류 " + c.kind());
        };
        if (!r.ok()) {
            log.warn("알림 실패 {} → {}: {}", c.kind(), c.to(), r.message());
        }
        return r;
    }
}
