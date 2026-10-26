package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드 엑셀 업로드 한 행 (P05, AS-IS ExcelUpload.fundUpload — fnd01_fund_code.excelInsert / fnd02_fund_info.excelInsert 값) */
public record FundExcelRow(
        Long fundCodeId, Long fundInfoId, Long companyId, String fundCode, LocalDate startDate, LocalDate endDate, String closeYn,
        LocalDate workDate, String fundName, String fundFullName, String kofiaFundCode, String kofiaFundTypeCode,
        String kofiaTrustCode, String kofiaPublicCode, String consignmentCode, String officeWorkCode, String orgCodeName,
        String operator1, String operator2, String ksdFundCode, String ksdItemCode) {
}
