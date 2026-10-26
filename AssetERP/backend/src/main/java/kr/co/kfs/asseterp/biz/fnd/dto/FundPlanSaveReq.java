package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 신규기획펀드 저장 요청 — 편집 폼이 바꾸는 속성만(AS-IS Fnd01_Edit_FundPlan). fundCodeId가 없거나 0 이하면 새 행 */
public record FundPlanSaveReq(Long fundCodeId, Long fundInfoId, String fundCode, String fundName,
                              String kofiaFundTypeCode, LocalDate startDate, LocalDate endDate, String closeYn,
                              String kofiaTrustCode, String kofiaPublicCode, String operator1, String operator2,
                              Long realFundId, LocalDate workDate, String planInvestorDscr, String planNote, String note) {
}
