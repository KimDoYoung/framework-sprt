package kr.co.kfs.asseterp.biz.adv.dto;

import java.time.LocalDate;

/** 일임보유주식(타사무) 한 행 (Q03, AS-IS Adv11_BookExtrModel) */
public record BookExtrRes(
        Long bookExtrId,
        LocalDate stdDate,
        String manageCode,
        String manageName,
        String itemCode,
        String itemName,
        String itemType,
        String itemTypeName
) {
}
