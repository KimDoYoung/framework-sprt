package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** apr01_appr.selectByText(preProvideRcvApprYn=true) 조건 (L06) */
public record AprPreProvideCond(Long companyId, Long regEmpId, LocalDate startDate, LocalDate endDate) {
}
