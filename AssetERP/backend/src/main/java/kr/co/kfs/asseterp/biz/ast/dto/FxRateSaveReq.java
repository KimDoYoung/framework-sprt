package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

/** AS-IS Ast24_FxRate.update — 고친 행(fxRateId 0 이하는 새 행) */
public record FxRateSaveReq(@Valid List<Item> items) {
    public record Item(Long fxRateId, LocalDate stdDate, String curCode, Double applyFxRate, String note) {
    }
}
