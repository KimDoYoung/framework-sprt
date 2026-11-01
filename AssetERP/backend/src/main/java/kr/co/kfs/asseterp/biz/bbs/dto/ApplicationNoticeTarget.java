package kr.co.kfs.asseterp.biz.bbs.dto;

/** 알림 수신자 (AS-IS emp00_trans_info.selectSmsNoticeTarget) */
public record ApplicationNoticeTarget(Long personId, String korName, String mobileTelno) {
}
