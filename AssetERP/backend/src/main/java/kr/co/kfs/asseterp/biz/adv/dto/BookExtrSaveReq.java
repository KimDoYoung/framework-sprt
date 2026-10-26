package kr.co.kfs.asseterp.biz.adv.dto;

import java.time.LocalDate;

/** 일임보유주식(타사무) 저장 한 행 (Q03, AS-IS Adv11_BookExtr.update). bookExtrId가 DB에 없으면(0 이하 포함) 새 행 */
public record BookExtrSaveReq(
        Long bookExtrId,
        LocalDate stdDate,
        String manageCode,
        String manageName,
        String itemCode,
        String itemName,
        String itemType
) {
}
