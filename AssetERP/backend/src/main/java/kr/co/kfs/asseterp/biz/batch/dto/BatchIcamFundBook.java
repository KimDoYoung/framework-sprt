package kr.co.kfs.asseterp.biz.batch.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** icam06_fund_book 한 건 (AS-IS Icam06_FundBookModel) */
public record BatchIcamFundBook(
        String icamCompanyCode,
        LocalDate stdDate,
        String fundCode,
        String fundName,
        String multiClassCode,
        String cur,
        BigDecimal setQty,
        BigDecimal setAmt,
        BigDecimal principal,
        BigDecimal nav,
        BigDecimal totalAsset,
        BigDecimal stdPrice,
        BigDecimal taxPrice,
        BigDecimal forSetAmt,
        BigDecimal forPrincipal,
        BigDecimal forNav,
        BigDecimal forTotalAsset,
        BigDecimal forStdPrice,
        BigDecimal forTaxPrice,
        String worker
) {
}
