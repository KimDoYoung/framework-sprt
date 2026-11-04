package kr.co.kfs.asseterp.biz.emp.dto;

/** 알림수신인 저장 한 줄 (AS-IS emp.Emp93_SmsNoticeTarget.update → UpdateDataModel). smsNoticeTargetId가 0 이하면 새 행 */
public record SmsNoticeTargetSaveReq(Long smsNoticeTargetId, Long personId, String smsNoticeCd, String note) {
}
