package kr.co.kfs.asseterp.biz.emp.dto;

/** 휴가사용 내역 엑셀 (AS-IS Sys99_Print.insertRdLeaveManager의 selectPersonId·stdYear) */
public record LeaveDownloadReq(Long personId, String stdYear) {
}
