package kr.co.kfs.asseterp.biz.emp.dto;

/** SMS구분코드별 알림 대상 (AS-IS Emp93_SmsNoticeTargetModel — emp93_sms_notice_target.selectBySmsNoticeCode). personInfo = "이름 (조직)" */
public record SmsNoticeTargetRes(Long smsNoticeTargetId, Long personId, String smsNoticeCd, String personInfo, String note) {
}
