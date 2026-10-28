package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 급여공제정보 사원 목록 한 행 (S28, AS-IS Emp35_DeductModel — emp35_deduct.selectByStdDate) */
public record DeductPersonRes(Long deductId, Long companyId, Long personId, String personNo, String personName,
                              LocalDate hireDate, LocalDate birthday, Long basicDeductCnt,
                              String addDeductYn, String insureYn, String reprYn, String npsYn, Long withHoldRate) {
}
