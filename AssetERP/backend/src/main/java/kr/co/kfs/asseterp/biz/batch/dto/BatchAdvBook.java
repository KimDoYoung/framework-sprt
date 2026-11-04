package kr.co.kfs.asseterp.biz.batch.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** adv10_book 한 건 — 자문/일임 운용자산 (AS-IS Adv10_BookModel) */
public record BatchAdvBook(
        Long bookId,
        LocalDate stdDate,
        Long companyId,
        String manageCode,
        String manageName,
        String itemCode,
        String itemName,
        BigDecimal qty,
        BigDecimal evalAmt,
        String itemGroupCode,
        String itemGroupName,
        String marketCode,
        String marketName,
        String creater
) {
}
