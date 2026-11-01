package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** 평가처리·취소 대상 한 줄 — 조회로 받은 {@link EvalRes}의 값을 그대로 돌려준다(AS-IS는 Ast06_TrModel 통째) */
public record EvalItemReq(
        @NotNull Long trId, @NotNull Long astClassTreeId, @NotNull LocalDate date, String trCode, String evalType, Long amt,
        Double forAmt, String curCode, String note, Long trFinanceId, @NotNull Long accountId, Double qty, Long trUnit,
        Long bookAmt, Double forBookAmt) {
}
