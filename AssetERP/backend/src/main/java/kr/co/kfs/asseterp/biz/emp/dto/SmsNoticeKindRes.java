package kr.co.kfs.asseterp.biz.emp.dto;

/** 특정알림 구분 한 행 (AS-IS Emp93_SmsNoticeTargetModel — emp93_sms_notice_target.getSmsNoticeList): 코드·이름 */
public record SmsNoticeKindRes(Long smsNoticeTargetId, String smsNoticeCd, String smsNoticeName) {
}
