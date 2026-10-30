package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** AS-IS ast.Ast06_Tr.update4Insure — trId가 없으면 새 거래(NEW). 금액(amt)은 서버가 네 보험의 납부금액 합으로 정한다 */
public record Tr4InsureSaveReq(
        Long trId,
        /** 거래유형(화면별)이 정한 자산분류 — 새 거래에만 쓴다(AS-IS openNew의 astClassTreeId) */
        Long astClassTreeId,
        @NotNull LocalDate date,
        @NotBlank String trCode,
        boolean settleMngYn,
        String note,
        Long depositId,
        Long npWithholding,
        Long npCompany,
        Long npEtc,
        String npEtcNote,
        Long hiWithholding,
        Long hiCompany,
        Long hiEtc,
        String hiEtcNote,
        Long eiWithholding,
        Long eiCompany,
        Long eiEtc,
        String eiEtcNote,
        Long ohCompany,
        Long ohEtc,
        String ohEtcNote,
        Long settleAmt
) {
}
