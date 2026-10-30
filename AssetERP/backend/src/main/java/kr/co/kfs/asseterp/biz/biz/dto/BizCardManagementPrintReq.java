package kr.co.kfs.asseterp.biz.biz.dto;

/** [엑셀다운로드] 자료 만들기 (AS-IS Sys99_Print.insertRdCardManagement) — 기간은 yyyy.MM, managerId·providePurCode `%`는 전체, searchText는 감싸기 전 글자 */
public record BizCardManagementPrintReq(String startYm, String closeYm, String managerId, String providePurCode, String searchText) {
}
