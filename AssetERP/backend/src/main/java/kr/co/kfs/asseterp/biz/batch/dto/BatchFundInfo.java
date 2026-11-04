package kr.co.kfs.asseterp.biz.batch.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** fnd02_fund_info 한 건 (AS-IS Fnd02_FundInfoModel 중 assetErpFundInsert가 비교·입력하는 필드) */
public record BatchFundInfo(
        Long fundCodeId,
        LocalDate workDate,
        String fundName,
        String fundFullName,
        String consignmentCode,
        String officeWorkCode,
        String orgCodeName,
        String kofiaFundCode,
        String kofiaTrustCode,
        String kofiaFundTypeCode,
        String kofiaPublicCode,
        String kofiaParentCode,
        String kofiaClassTypeCode,
        String kofiaFundUnitCode,
        String kofiaCharClassCode,
        LocalDate endExpectDate,
        String trustBankCode,
        String operator1,
        String operator2,
        String cur,
        LocalDate nextCloseDate,
        LocalDate nextFeeDate,
        String ksdFundCode,
        String ksdItemCode,
        BigDecimal managementRate,
        BigDecimal salesRate,
        BigDecimal consignmentRate,
        BigDecimal officeWorkRate,
        BigDecimal seoljAek,
        BigDecimal sunjasanAek,
        String diffDivYn
) {
}
