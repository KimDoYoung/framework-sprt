package kr.co.kfs.asseterp.biz.fnd.dto;

/** 펀드 조회 [엑셀다운로드] 요청 — 화면의 조회 조건 그대로 (AS-IS Sys99_Print.insertRdFundSearch 파라미터) */
public record FundSearchPrintReq(boolean closeYn, String fundName, String fundTypeCode, String classTypeCode) {
}
