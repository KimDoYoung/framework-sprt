package kr.co.kfs.asseterp.biz.batch.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** icam02_data 한 건 (AS-IS Icam02_DataModel 중 insert에 쓰는 필드) */
public record BatchIcamData(
        String icamCompanyCode,
        LocalDate icamDate,
        String fundCode,
        String fundName,
        String itemCode,
        String itemName,
        Long seq,
        String infoCode,
        String trCode,
        String assetCode,
        String assetName,
        LocalDate tgtDate,
        BigDecimal tgtAmt,
        LocalDate tgtStdDate,
        String note,
        String creater
) {
}
