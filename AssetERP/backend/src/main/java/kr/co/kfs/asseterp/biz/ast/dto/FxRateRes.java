package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS ast24_fx_rate.selectByStdDate — 환율입력 조회창 한 행 (fxRateType 01:평가환율) */
public record FxRateRes(
        Long fxRateId,
        Long companyId,
        String fxRateType,
        LocalDate stdDate,
        String curCode,
        Double applyFxRate,
        String note
) {
}
