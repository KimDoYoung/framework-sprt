package kr.co.kfs.asseterp.biz.batch.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** fnd10_book 한 건 — 펀드별 운용자산 (AS-IS Fnd10_BookModel 중 icamBook이 넣는 필드) */
public record BatchFndBook(
        Long bookId,
        LocalDate stdDate,
        Long fundCodeId,
        Long astClassTreeId,
        Long companyId,
        BigDecimal purAmt,
        BigDecimal evalAmt,
        BigDecimal evalPlAmt,
        BigDecimal recvAmt,
        String note,
        String creater,
        String detailType,
        String itemCode,
        String itemGroupCode,
        String itemGroupName,
        String marketCode,
        String marketName
) {
}
