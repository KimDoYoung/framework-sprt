package kr.co.kfs.asseterp.biz.batch.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** icam03_fund 한 건 (AS-IS Icam03_FundModel). 열 이름은 AS-IS SELECT 별칭(icam03_*)에서 온다. */
public record BatchIcamFund(
        String icamCompanyCode,
        String icamCompanyName,
        LocalDate stdDate,
        String fundCode,
        String fundName,
        String fundFullName,
        String kofiaFundCode,
        String trustCode,
        String fundTypeCode,
        String publicCode,
        String parentCode,
        String classTypeCode,
        String fundUnitCode,
        String charClassCode,
        LocalDate setDate,
        LocalDate endDate,
        LocalDate endExpectDate,
        String operator1,
        String operator2,
        String oprDept,
        String consignmentCode,
        String consignmentName,
        String trustBankCode,
        String trustBankName,
        String officeWorkCode,
        String officeWorkName,
        String cur,
        LocalDate closeDate,
        LocalDate feeDate,
        String worker,
        String ksdFundCode,
        String ksdItemCode,
        BigDecimal managementRate,
        BigDecimal salesRate,
        BigDecimal consignmentRate,
        BigDecimal officeWorkRate,
        BigDecimal setAmt,
        BigDecimal nav,
        String diffDivYn
) {
}
