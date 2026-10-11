package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** AS-IS Emp14_TabPage_Account.update() → UpdateDataModel(emp14_account) */
public record AccountSaveReq(
        Long accountId,
        Long personId,
        LocalDate startDate,
        String bankCd,
        String accountNoDec,
        String note
) {}
