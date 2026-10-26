package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 상품기획일정 등록(P03) 위 그리드 한 행 — AS-IS Fnd01_FundCodeModel 중 Fnd20_Tab_Plan 그리드 열 (selectByPlan) */
public record FundPlanListRes(Long fundCodeId, String fundCode, String fundName, String kofiaFundTypeName, LocalDate startDate,
                              LocalDate endDate, String closeName, String kofiaTrustName, String kofiaPublicName, String orgCodeName,
                              String operator1, String operator2, String note) {
}
