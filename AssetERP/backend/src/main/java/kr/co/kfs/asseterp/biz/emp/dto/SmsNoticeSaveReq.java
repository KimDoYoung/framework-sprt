package kr.co.kfs.asseterp.biz.emp.dto;

/** 알림설정 저장 한 행 (AS-IS Emp92_Lookup_SmsNotice.update 가 보내는 바뀐 행) */
public record SmsNoticeSaveReq(String smsNoticeCode, Boolean talkNoticeYn, Boolean smsNoticeYn, Boolean mailNoticeYn) {
}
