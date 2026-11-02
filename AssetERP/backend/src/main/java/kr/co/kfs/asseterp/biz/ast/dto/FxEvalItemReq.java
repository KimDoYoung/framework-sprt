package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS Ast06_Tr.updateFxEval 목록 한 건 — 평가처리/취소할 그리드 행(조회 때 받은 값 + 화면에서 고친 평가환율) */
public record FxEvalItemReq(
        Long trId,
        Long astClassTreeId,
        Long depositId,
        LocalDate date,
        String trCode,
        String curCode,
        Double fxRate,
        Double forAmt,
        Long depositBookAmt,
        Long corpId,
        String note,
        String evalYnName
) {
}
