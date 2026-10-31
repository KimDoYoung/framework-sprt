package kr.co.kfs.asseterp.biz.biz.dto;

/** 변경년월의 월 통합 상신 (AS-IS Biz61_ModiRptRelateApprModel — biz61_modi_rpt_relate_appr.selectByCompanyId). 상신한 적 없으면 응답 data가 null */
public record FundPriceModiMonthRes(Long modiRptRelateApprId, Long apprId, String statusCode, String statusName) {
}
