package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** AS-IS emp35_deduct.selectByPersonId (SELECT *) */
public record DeductRes(
        Long deductId,
        Long companyId,
        Long personId,
        LocalDate startDate,
        Long basicDeductCnt,
        String addDeductYn,
        String insureYn,
        String reprYn,
        Long withHoldRate,
        String note,
        Long childDeductCnt
) {}
