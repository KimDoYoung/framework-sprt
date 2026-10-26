package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드보유주식(타사무) 한 행 (P11, AS-IS Fnd11_BookExtrModel) */
public record BookExtrRes(
        Long bookExtrId,
        LocalDate stdDate,
        String fundCode,
        String fundName,
        String itemCode,
        String itemName,
        String itemType,
        String itemTypeName
) {
}
