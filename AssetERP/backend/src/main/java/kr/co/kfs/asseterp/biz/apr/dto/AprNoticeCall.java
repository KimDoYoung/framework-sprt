package kr.co.kfs.asseterp.biz.apr.dto;

/**
 * 보낼(또는 보낸) 알림 한 건 — kind는 talk | sms | mail. sms의 to는 하이픈을 뺀 번호 (AA01).
 * companyId: sms면 발송 성공 기록(sms02_history)을 남길 회사 — AlertService가 채운다(없으면 기록하지 않음)
 */
public record AprNoticeCall(String kind, String to, String title, String body, Long companyId) {

    public AprNoticeCall(String kind, String to, String title, String body) {
        this(kind, to, title, body, null);
    }
}
