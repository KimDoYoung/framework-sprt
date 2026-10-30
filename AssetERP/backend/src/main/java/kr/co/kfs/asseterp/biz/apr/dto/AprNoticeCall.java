package kr.co.kfs.asseterp.biz.apr.dto;

/** 보낼(또는 보낸) 알림 한 건 — kind는 talk | sms | mail. sms의 to는 하이픈을 뺀 번호 (AA01) */
public record AprNoticeCall(String kind, String to, String title, String body) {
}
