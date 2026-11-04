package kr.co.kfs.asseterp.biz.batch.dto;

import java.math.BigDecimal;

/** ifi30_fund 한 건 + 맵핑된 회사ID (AS-IS Ifi30_FundModel). 날짜는 AS-IS처럼 yyyyMMdd 문자열 */
public record BatchExtrFund(
        String ifCode,
        String sendDate,
        String fundCode,
        String fundName,
        String firstSetDate,
        String endDate,
        String endYn,
        String kofiaFundCode,
        String ksdFundCode,
        String ksdItemCode,
        String kofiaTrustCode,
        String kofiaFundTypeCode,
        String kofiaPublicCode,
        String kofiaParentCode,
        String kofiaClassTypeCode,
        String kofiaFundUnitCode,
        String kofiaCharClassCode,
        BigDecimal setAmt,
        BigDecimal nav,
        String oprDept,
        String operator1,
        String operator2,
        String custCode,
        String custName,
        String officeWorkCode,
        String officeWorkName,
        BigDecimal amRate,
        BigDecimal salesRate,
        BigDecimal custRate,
        BigDecimal officeWorkRate,
        String curCode,
        String matDueDate,
        String nextCloseDate,
        String nextFeeDate,
        Long companyId
) {
}
