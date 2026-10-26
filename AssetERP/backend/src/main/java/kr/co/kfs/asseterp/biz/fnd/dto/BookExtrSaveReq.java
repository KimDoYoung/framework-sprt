package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드보유주식(타사무) 저장 한 행 (P11, AS-IS Fnd11_BookExtr.update). bookExtrId가 DB에 없으면(0 이하 포함) 새 행 */
public record BookExtrSaveReq(
        Long bookExtrId,
        LocalDate stdDate,
        String fundCode,
        String fundName,
        String itemCode,
        String itemName,
        String itemType
) {
}
