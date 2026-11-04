package kr.co.kfs.asseterp.biz.batch.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** icam10_fee 한 건 (AS-IS Icam10_FeeModel) — ICAM 보수 발생내역 */
public record BatchIcamFee(
        Long companyId,
        LocalDate stdDate,
        String icamCompanyCode,
        String icamCompanyName,
        String feeType,
        String rmkCode,
        String rmkName,
        String drcrType,
        String fundCode,
        String fundName,
        BigDecimal fee,
        String curCode,
        BigDecimal fxRate,
        LocalDate afPayDate,
        LocalDate bfPayDate,
        String consignmentCode,
        String consignmentName,
        String worker
) {
}
