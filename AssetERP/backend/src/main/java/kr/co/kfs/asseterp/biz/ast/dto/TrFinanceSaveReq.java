package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/**
 * AS-IS ast.Ast06_Tr.updateFinance — trId가 없으면 새 거래(NEW). ast06_tr + ast08_tr_finance 반영, 금융자산 보유원장 반영.
 * 필수 검사 메시지는 AS-IS Ast06_Lookup_TrIPO.preUpdate L720-783
 */
public record TrFinanceSaveReq(
        Long trId,
        @NotNull LocalDate date,
        @NotBlank String trCode,
        Long astClassTreeId,
        Long corpId,
        Long depositId,
        boolean settleMngYn,
        Long amt,
        Long fee,
        String note,
        String curCode,
        Long accountId,
        Double qty,
        Double price,
        Long trAmt,
        String lockUpPeriodCode,
        LocalDate lockUpDate,
        LocalDate listDate,
        /** 금융상품 거래처리(W06) 편집창이면 true — 세금·이자(거래세·법인세·지방세·이자금액·경과이자금액)도 저장하고 미수/미지급 필수 검사 문구가 다르다 */
        boolean detail,
        Long trTax,
        Long corpTax,
        Long localTax,
        Long intAmt,
        Long acrIntAmt
) {
}
