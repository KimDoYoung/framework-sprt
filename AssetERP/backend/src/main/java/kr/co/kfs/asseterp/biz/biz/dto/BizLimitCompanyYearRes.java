package kr.co.kfs.asseterp.biz.biz.dto;

/** 이익제공 한도초과현황 — 회사별 연간 초과건 한 행 (AS-IS Biz01_TabPage_CompanyYear 그리드 열, L07) */
public record BizLimitCompanyYearRes(String provideRcvTypeName, String targetCompanyName, Long averagePrice) {
}
