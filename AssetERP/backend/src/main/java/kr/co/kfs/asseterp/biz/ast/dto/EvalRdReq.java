package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** [출력/다운로드] 조건 — AS-IS insertRdEvalFinance(closeDate·corpId·accountId·classTreeId·searchText·evalType) */
public record EvalRdReq(@NotNull LocalDate closeDate, Long corpId, Long accountId, Long classTreeId, String searchText, String evalType) {
}
