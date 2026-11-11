package kr.co.kfs.asseterp.biz.apr.service;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.transaction.support.TransactionTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprAlertAppr;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticeCall;
import kr.co.kfs.asseterp.biz.apr.dto.AprNoticePerson;
import kr.co.kfs.asseterp.biz.apr.mapper.AprNoticeMapper;
import kr.co.kfs.asseterp.biz.sms.mapper.SmsHistoryMapper;
import kr.co.kfs.asseterp.common.config.properties.NoticeProperties;
import kr.co.kfs.asseterp.common.notice.NoticeResult;
import kr.co.kfs.asseterp.common.notice.NoticeSender;
import lombok.extern.slf4j.Slf4j;

/**
 * 통합알림 — AS-IS server/utils/alert/AlertService (98d5afdd6, 2026-11-11). 한 사람에게 알림코드(smsNoticeCode) 하나로 앱알림·메일·SMS를 보낸다.
 * <ul>
 *   <li>앱알림: 이메일이 있고 수신차단(emp92 sendCheckTalk)이 아니면. 제목은 코드별(getTitle), 본문은 getMsg</li>
 *   <li>메일: 이메일이 있고 차단(sendCheckMail)이 아니고, 회사 메일 발송({위치}.Mailok)이거나 코드가 M으로 시작하면. 제목 "[알림] Asset-ERP"(SendMailMaster.sendPromoMessage), 본문 getMsg</li>
 *   <li>SMS: 휴대폰이 있고 차단(sendCheckSms)이 아니고, 회사 SMS 발송({위치}.SMSok)이거나 코드가 M으로 시작하면. 본문 getMsg + 접속 주소(EUC-KR로 바꿨다 되돌림)</li>
 * </ul>
 * 발송 기록(sms02_history)은 원본처럼 두 번 남는다: ① AlertService가 보낸 뒤 비고 없이 ② SendSMSAPI.smsSender가 성공했을 때 비고 = 번호.
 * TOBE는 ①을 부른 쪽 트랜잭션에서 쓰고, 실제 발송과 ②는 커밋 뒤(롤백이면 안 보냄) 따로 트랜잭션으로 쓴다.
 * 코드 T04(스케줄 알림)는 메일을 보낼 때 sch07_alarm_record에 보낸 주소를 남긴다.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class AlertService {

    static final String MAIL_SUBJECT = "[알림] Asset-ERP";
    static final String SMS_TITLE = "[Asset-ERP 알림]";
    private static final Charset EUC_KR = Charset.forName("EUC-KR");

    private final AprNoticeMapper mapper;
    private final SmsHistoryMapper smsHistoryMapper;
    private final NoticeProperties props;
    private final NoticeSender sender;
    private final TransactionTemplate newTx;

    public AlertService(AprNoticeMapper mapper, SmsHistoryMapper smsHistoryMapper, NoticeProperties props, NoticeSender sender,
                        PlatformTransactionManager txManager) {
        this.mapper = mapper;
        this.smsHistoryMapper = smsHistoryMapper;
        this.props = props;
        this.sender = sender;
        this.newTx = new TransactionTemplate(txManager);
        this.newTx.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
    }

    /**
     * 누구에게 무엇을 보낼지 (DB 읽기만). params: apprId·code(T011·T012·T013·T02), classTreeName·titleName(T012 code 99),
     * count(A01~A03·B01·B02), content(그 밖의 코드), alarmRecordId(T04)
     */
    public List<AprNoticeCall> plan(String smsNoticeCode, Long personId, Long companyId, Map<String, ?> params) {
        List<AprNoticeCall> out = new ArrayList<>();
        AprNoticePerson p = personId == null ? null : mapper.selectPerson(personId);
        if (p == null) {
            return out;   // AS-IS는 NPE로 멈춘다 — 부르는 쪽이 모두 사원이 있을 때만 부른다
        }
        String loc = mapper.selectCompanyLoc(companyId);
        boolean mCode = smsNoticeCode.startsWith("M");
        boolean talkChk = p.emailAddress() != null && mapper.countTalkBlocked(personId, smsNoticeCode) == 0;
        boolean mailChk = p.emailAddress() != null && mapper.countMailBlocked(personId, smsNoticeCode) == 0
                && (mCode || props.mailEnabled(loc));
        boolean smsChk = p.mobileTelNo() != null && mapper.countSmsBlocked(personId, smsNoticeCode) == 0
                && (mCode || props.smsEnabled(loc));

        String title = title(smsNoticeCode);
        String msg = msg(smsNoticeCode, params);
        if (talkChk) {
            out.add(new AprNoticeCall("talk", p.emailAddress(), title, msg));
        }
        if (mailChk) {
            out.add(new AprNoticeCall("mail", p.emailAddress(), MAIL_SUBJECT, msg));
        }
        if (smsChk) {
            String content = msg + "\r\n\r\n https://" + loc + ".k-fs.co.kr:5151/";
            out.add(new AprNoticeCall("sms", p.mobileTelNo().replace("-", ""), SMS_TITLE, new String(content.getBytes(EUC_KR), EUC_KR), companyId));
        }
        return out;
    }

    /** plan → 기록(SMS 발송 기록 ①, T04 메일 주소) → 커밋 뒤 발송 */
    @Transactional
    public List<AprNoticeCall> alert(String smsNoticeCode, Long personId, Long companyId, Map<String, ?> params) {
        List<AprNoticeCall> calls = plan(smsNoticeCode, personId, companyId, params);
        record(smsNoticeCode, calls, params);
        dispatchAfterCommit(calls);
        return calls;
    }

    /** 이미 정한 알림의 기록만 (AprNoticeService처럼 여러 사람을 모아 plan한 경우) */
    @Transactional
    public void record(String smsNoticeCode, List<AprNoticeCall> calls, Map<String, ?> params) {
        for (AprNoticeCall c : calls) {
            if ("sms".equals(c.kind()) && c.companyId() != null) {
                smsHistoryMapper.insertHistory(c.companyId(), c.body(), null);
            }
            if ("mail".equals(c.kind()) && "T04".equals(smsNoticeCode) && params != null && params.get("alarmRecordId") != null) {
                mapper.updateAlarmRecordSendInfo(((Number) params.get("alarmRecordId")).longValue(), c.to());
            }
        }
    }

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

    /** 한 건 보내기 — 실패는 로그만(AS-IS도 예외를 삼켰다). SMS가 성공하면 발송 기록 ②(비고 = 번호, SendSMSAPI.smsSender L339-349) */
    NoticeResult send(AprNoticeCall c) {
        NoticeResult r = switch (c.kind()) {
            case "talk" -> sender.sendTalk(c.to(), c.title(), c.body());
            case "sms" -> sender.sendSms(List.of(c.to()), c.body());
            case "mail" -> sender.sendMail(c.to(), c.title(), c.body());
            default -> NoticeResult.fail("알 수 없는 종류 " + c.kind());
        };
        if (!r.ok()) {
            log.warn("알림 실패 {} → {}: {}", c.kind(), c.to(), r.message());
        } else if ("sms".equals(c.kind()) && c.companyId() != null) {
            try {
                newTx.executeWithoutResult(s -> smsHistoryMapper.insertHistory(c.companyId(), c.body(), c.to()));
            } catch (RuntimeException e) {
                log.warn("SMS 발송 기록 실패 → {}: {}", c.to(), e.getMessage());
            }
        }
        return r;
    }

    /** AS-IS getTitle */
    static String title(String code) {
        return switch (code) {
            case "T011" -> "상신문서 (결재순서)";
            case "T012" -> "상신문서 (결재완료)";
            case "T013" -> "폐기문서 승인요청";
            case "T02" -> "휴가취소";
            case "T03" -> "문서 댓글알림";
            case "T04" -> "스케줄 알림";
            case "T05" -> "책무알림";
            case "A01" -> "임직원매매 사전신고 승인완료";
            case "A02" -> "사업비 요청 반려";
            case "A03" -> "지출결의 반려";
            case "B01" -> "임직원매매 사전신고 승인요청";
            case "B02" -> "사업비지출 승인요청";
            case "B03" -> "기타신청서 신청요청";
            case "M01" -> "화환신청";
            case "M02" -> "법인카드 사용내역";
            case "M03" -> "복리후생비 알림";
            case "M04" -> "휴가 사용/지정통보";
            case "M05" -> "연차 초과사용 승인요청";
            case "M06" -> "비밀번호 재설정";
            default -> "";
        };
    }

    /** AS-IS getMsg */
    String msg(String code, Map<String, ?> p) {
        switch (code) {
            case "T011", "T012" -> {
                String c = str(p, "code");
                if ("T012".equals(code) && "99".equals(c)) {
                    // 상신과 동시에 결재완료 — 문서가 아직 없어 넘어온 분류·제목으로. 문구가 "승인 취소로 중단"인 것은 원본 그대로
                    return "결재문서 " + " '(" + str(p, "classTreeName") + ") " + str(p, "titleName") + "' 건이 직전 결재자의 승인 취소로 인해 결재가 중단되었습니다.";
                }
                AprAlertAppr a = mapper.selectApprAlert(longOf(p, "apprId"));
                String head = "결재문서 " + " '(" + a.classTreeNameAllPath() + ") " + a.title() + "' 건";
                return switch (c == null ? "" : c) {
                    case "20" -> head + "의 다음 결재자입니다.";
                    case "30" -> head + "이 결재완료되었습니다.";
                    case "40" -> head + "이 반려되었습니다.";
                    case "50" -> head + "이 직전 결재자의 승인 취소로 인해 결재가 중단되었습니다.";
                    default -> "";
                };
            }
            case "T013" -> {
                return "'" + mapper.selectApprAlert(longOf(p, "apprId")).title() + "' 문서폐기 신청이 도착했습니다. ※ 승인처리 화면:[1490 폐기문서 승인]";
            }
            case "T02" -> {
                return "[Asset-ERP] " + mapper.selectApprAlert(longOf(p, "apprId")).title() + " 취소되었습니다.";
            }
            case "A01" -> {
                return "[Asset-ERP] 임직원 매매 사전신청 " + str(p, "count") + "건이 완료되었습니다.";
            }
            case "A02" -> {
                return "[Asset-ERP] 사업비요청 " + str(p, "count") + "건이 반려되었습니다";
            }
            case "A03" -> {
                return "[Asset-ERP] 지출결의 " + str(p, "count") + "건이 반려되었습니다";
            }
            case "B01" -> {
                return "[Asset-ERP] 임직원 매매 사전 승인신청 " + str(p, "count") + "건이 존재합니다.";
            }
            case "B02" -> {
                return "[Asset-ERP] 사업비지출 승인요청 " + str(p, "count") + "건이 존재합니다";
            }
            default -> {
                return str(p, "content");
            }
        }
    }

    private static String str(Map<String, ?> p, String key) {
        Object v = p == null ? null : p.get(key);
        return v == null ? null : String.valueOf(v);
    }

    private static Long longOf(Map<String, ?> p, String key) {
        Object v = p == null ? null : p.get(key);
        return v == null ? null : ((Number) v).longValue();
    }
}
