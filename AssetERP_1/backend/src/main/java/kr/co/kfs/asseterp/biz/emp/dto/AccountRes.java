package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** AS-IS emp14_account.selectByPersonId */
public record AccountRes(
        Long accountId,
        Long companyId,
        Long personId,
        LocalDate startDate,
        String bankCd,
        String bankName,
        String accountNoDec,
        String note
) {}
