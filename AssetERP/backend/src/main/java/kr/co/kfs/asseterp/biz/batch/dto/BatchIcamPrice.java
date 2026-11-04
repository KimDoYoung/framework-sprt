package kr.co.kfs.asseterp.biz.batch.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** icam20_price 한 건 (AS-IS Icam20_PriceModel) */
public record BatchIcamPrice(
        LocalDate stdDate,
        String itemType,
        String itemCode,
        String itemName,
        String koscomCode,
        String isin,
        String ksdItemCode,
        BigDecimal closePrice,
        BigDecimal preClosePrice,
        String marketType,
        String worker
) {
}
