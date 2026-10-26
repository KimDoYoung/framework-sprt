package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 신규기획펀드 한 행 — AS-IS Fnd01_FundCodeModel(임시펀드: planYn=true) 중 목록 그리드와 편집 폼이 쓰는 속성 */
public record FundPlanRes(Long fundCodeId, Long fundInfoId, String fundCode, String fundName,
                          String kofiaFundTypeCode, String kofiaFundTypeName, LocalDate startDate, LocalDate endDate,
                          String closeYn, String closeName, String kofiaTrustCode, String kofiaTrustName,
                          String kofiaPublicCode, String kofiaPublicName, String orgCodeName, String operator1, String operator2,
                          Long realFundId, String realFundCode, String realFundName, LocalDate workDate,
                          String planInvestorDscr, String planNote, String note, String icamYn, Long companyId) {
}
