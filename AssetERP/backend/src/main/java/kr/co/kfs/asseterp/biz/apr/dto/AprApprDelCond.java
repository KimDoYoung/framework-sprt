package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** apr99_appr_del.selectByCompanyId 조건 (Apr01_Tab_Restore). orgName·personName·aprName은 LIKE 값('%'=전체) */
public record AprApprDelCond(Long companyId, LocalDate startDate, LocalDate closeDate, String orgName, String personName, String aprName) {
}
