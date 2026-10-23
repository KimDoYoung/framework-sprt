package kr.co.kfs.asseterp.biz.bmt.dto;

import java.time.LocalDate;

/** Bmt01_Tab_Buy [저장] — 화면이 바꾸는 열(구매일자·구매품목·구매수량·구입금액·담당자). buyId ≤ 0이면 새 행 */
public record BmtBuySaveReq(
        Long buyId,
        LocalDate buyDate,
        String provideContentCode,
        Long buyQty,
        Long buyAmt,
        Long personId
) {
}
