package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** AS-IS ast.Ast06_Tr.updateTax — trId가 없으면 새 거래(NEW). 세금 상세(ast20_tr_tax)도 함께 저장 */
public record TrTaxSaveReq(
        Long trId,
        @NotNull LocalDate date,
        @NotBlank String trCode,
        Long amt,
        boolean settleMngYn,
        String note,
        Long depositId,
        Long incomeTax,
        Long localTax,
        Long etcTax,
        Long prePayVat,
        Long preRcvVat
) {
}
