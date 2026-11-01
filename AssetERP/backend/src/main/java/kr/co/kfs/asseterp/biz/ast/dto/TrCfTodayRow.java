package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS ast06_tr.selectTodayCf 한 줄 — 서버 안에서만 쓴다(거래로 옮겨 넣을 값) */
public record TrCfTodayRow(
        Long astClassTreeId,
        LocalDate date,
        String trCode,
        Long amt,
        Long tax,
        String note,
        Long corpId,
        String curCode,
        Long contAmt,
        Long orgTrId
) {
}
