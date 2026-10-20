package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** AS-IS apr01_appr.selectByTotalList 조건 (G16 Apr01_Tab_TotalList 운영현황표). personName·orgName은 %…%, 기간은 시행일(apr01_effect_date) 기준 */
public record AprTotalListCond(Long companyId, String personName, String orgName, LocalDate startDate, LocalDate closeDate) {
}
