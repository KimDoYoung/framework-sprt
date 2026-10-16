package kr.co.kfs.asseterp.biz.sys.dto;

/** Admin 로그인내역 한 행 (AS-IS Sys81_AdminUserHistoryModel). regDate는 'YYYY-MM-DD', regTime은 'HH24:MI' */
public record AdminUserHistoryRes(Long adminUserHistoryId, String regDate, String regTime, String user, String smsContent) {
}
