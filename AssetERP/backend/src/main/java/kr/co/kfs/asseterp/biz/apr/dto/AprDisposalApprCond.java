package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** apr90_disposal_list.selectByCompanyId 조건 (F10). disposalCode는 LIKE 값('%'=전체) */
public record AprDisposalApprCond(Long companyId, LocalDate startDate, LocalDate closeDate, String disposalCode, Long confirmEmpId) {
}
