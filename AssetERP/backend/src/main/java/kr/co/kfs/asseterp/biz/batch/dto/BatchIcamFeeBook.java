package kr.co.kfs.asseterp.biz.batch.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** icam12_fee_book 한 건 (AS-IS Icam12_FeeBookModel) — ICAM 말일 보수잔액 */
public record BatchIcamFeeBook(
        Long companyId,
        String icamCompanyCode,
        String icamCompanyName,
        LocalDate stdDate,
        String fundCode,
        String fundName,
        String curCode,
        BigDecimal forFee,
        BigDecimal fee,
        String consignmentCode,
        String consignmentName,
        String worker
) {
}
