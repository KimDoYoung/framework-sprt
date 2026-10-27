package kr.co.kfs.asseterp.biz.icam.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FundOperateStatusDetailRes(
        Long fundBookId,
        LocalDate stdDate,
        String fundCode,
        String fundName,
        Long principal,
        Long nav,
        Long totalAsset,
        BigDecimal setQty,
        BigDecimal stdPrice,
        String cur
) {
}
