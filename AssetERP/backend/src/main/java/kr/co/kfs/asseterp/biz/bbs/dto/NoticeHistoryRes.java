package kr.co.kfs.asseterp.biz.bbs.dto;

/** 공지 변경 기록 한 줄 (AS-IS Bbs09_NoticeHistoryModel). contentYn = 변경 전 내용(notice)이 남아 있는지 */
public record NoticeHistoryRes(Long noticeHistoryId, String regDateStr, String openYn, String personName, boolean contentYn, String notice) {
}
