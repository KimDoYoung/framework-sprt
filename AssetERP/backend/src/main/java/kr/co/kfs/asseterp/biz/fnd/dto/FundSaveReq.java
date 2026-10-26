package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드 등록 및 변경 저장 (P05, AS-IS Fnd01_Edit_FundCode.updateRow → fnd.Fnd01_FundCode.update). fundCodeId가 0 이하·null이면 새 펀드 */
public record FundSaveReq(
        Long fundCodeId, Long fundInfoId, String fundCode, String kofiaFundCode, String ksdFundCode, String ksdItemCode,
        String fundFullName, String fundName, String cur, Long seoljAek, Long sunjasanAek,
        LocalDate startDate, LocalDate nextCloseDate, LocalDate nextFeeDate, LocalDate endExpectDate, LocalDate endDate,
        String closeYn, String orgCodeName, String operator1, String operator2,
        String consignmentCode, String officeWorkCode, String trustBankCode,
        String kofiaTrustCode, String kofiaFundTypeCode, String kofiaPublicCode, String kofiaParentCode,
        String kofiaClassTypeCode, String kofiaFundUnitCode, String kofiaCharClassCode,
        Double managementRate, Double salesRate, Double consignmentRate, Double officeWorkRate,
        String note, LocalDate workDate) {
}
