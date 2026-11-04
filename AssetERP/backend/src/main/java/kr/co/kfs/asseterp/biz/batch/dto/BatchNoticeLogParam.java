package kr.co.kfs.asseterp.biz.batch.dto;

/** sys97_notice_log 한 건 (AS-IS BatchMain.insertNoticeLog) */
public record BatchNoticeLogParam(String procName, String noticeMsg, String errMsg, String note) {
}
