package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/**
 * AS-IS ast.Ast06_Tr.updateDepositInt (예금/예치금 이자수령, 거래유형 3212) — trId가 없으면 새 거래(NEW).
 * ast06_tr + ast08_tr_finance 반영. 실수령액(amt)은 서버가 이자 − 법인세 − 지방세로 계산한다(AS-IS setAmt)
 */
public record DepositIntSaveReq(
        Long trId,
        @NotNull LocalDate date,
        Long astClassTreeId,
        Long intAmt,
        Long corpTax,
        Long localTax,
        String note
) {
}
