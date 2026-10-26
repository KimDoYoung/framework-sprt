package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드 변경이력 한 행 (P08, AS-IS Fnd02_FundInfoModel 중 Fnd01_Grid_FundIcamHistory 열) */
public record FundInfoRes(
        Long fundInfoId, LocalDate workDate, String fundName, String fundFullName,
        String kofiaFundCode, String ksdFundCode, String ksdItemCode,
        String kofiaTrustName, String kofiaFundTypeName, String kofiaPublicName, String kofiaParentName,
        String kofiaClassTypeName, String kofiaFundUnitName, String kofiaCharClassName,
        String orgCodeName, String operator1, String operator2, String cur,
        Long seoljAek, Long sunjasanAek, Double stdPrice,
        LocalDate nextCloseDate, LocalDate nextFeeDate, LocalDate endExpectDate,
        String consignmentName, String trustBankName, String officeWorkName,
        Double managementRate, Double salesRate, Double consignmentRate, Double officeWorkRate) {
}
