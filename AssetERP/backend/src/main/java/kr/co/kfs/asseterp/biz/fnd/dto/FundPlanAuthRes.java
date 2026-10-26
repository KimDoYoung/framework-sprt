package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 신규기획펀드 권한설정 목록 한 행 — AS-IS Fnd01_FundCodeModel 중 Fnd08_Tab_OrgAuthTempFund 그리드 열 */
public record FundPlanAuthRes(Long fundCodeId, String fundCode, String fundName, String kofiaFundTypeName, LocalDate startDate,
                              LocalDate endDate, String closeName, String orgCodeName, String operator1, String note) {
}
