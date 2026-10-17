package kr.co.kfs.asseterp.biz.icam.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Icam02_DataModel 중 Icam99_Tab_Test 그리드 열 */
public record IcamDataRes(Long dataId, String icamCompanyCode, LocalDate icamDate, String fundCode, String fundName, String assetCode,
                          String assetName, String itemCode, String itemName, Long seq, String infoCode, String infoName,
                          String trCode, String trName, LocalDate tgtDate, BigDecimal tgtAmt, LocalDate tgtStdDate, String note,
                          String createDateString, String creater, Long icsClassTreeId, Long icsDeadlineId, String confirmYn,
                          Long confirmPersonId) {
}
