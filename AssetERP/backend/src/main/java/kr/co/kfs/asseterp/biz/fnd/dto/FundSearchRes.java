package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드 조회 한 행 (P07, FundRes + 최종 규약: AS-IS Fnd01_FundCodeModel의 termsId·revisionNo·revisionDate) */
public record FundSearchRes(
        Long fundCodeId, Long fundInfoId, String fundCode, String kofiaFundCode, String ksdFundCode, String ksdItemCode,
        String fundFullName, String fundName, String cur, Long seoljAek, Long sunjasanAek,
        LocalDate startDate, LocalDate nextCloseDate, LocalDate nextFeeDate, LocalDate endExpectDate, LocalDate endDate,
        String closeYn, String closeName, String orgCodeName, String operator1, String operator2,
        String consignmentCode, String consignmentName, String officeWorkCode, String officeWorkName,
        String trustBankCode, String trustBankName,
        String kofiaTrustCode, String kofiaTrustName, String kofiaFundTypeCode, String kofiaFundTypeName,
        String kofiaPublicCode, String kofiaPublicName, String kofiaParentCode, String kofiaParentName,
        String kofiaClassTypeCode, String kofiaClassTypeName, String kofiaFundUnitCode, String kofiaFundUnitName,
        String kofiaCharClassCode, String kofiaCharClassName,
        Double managementRate, Double salesRate, Double consignmentRate, Double officeWorkRate,
        String note, String icamYn, LocalDate workDate, Long companyId,
        Long termsId, Long revisionNo, LocalDate revisionDate) {
}
