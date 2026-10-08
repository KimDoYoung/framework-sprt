package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 신규사원 등록 때 만드는 급여공제(emp35_deduct) 기본 행 */
public record DeductRow(
        Long deductId,
        Long companyId,
        Long personId,
        LocalDate startDate
) {
}
