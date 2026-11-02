package kr.co.kfs.asseterp.biz.icam.dto;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

/** AS-IS Icam11_FeeDeposit.update — 고친 행(feeDepositId 0 이하는 새 행) */
public record IcamFeeDepositSaveReq(@Valid List<Item> items) {
    public record Item(Long feeDepositId, String icamCompanyCode, String fundCode, LocalDate startDate, Long depositId) {
    }
}
