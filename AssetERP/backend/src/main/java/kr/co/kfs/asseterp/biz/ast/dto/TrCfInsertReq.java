package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** AS-IS ast.Ast06_Tr.insertByCf — 기준일의 C/F 내역을 거래로 가져온다(assetType "1" 고유자산은 서버가 고정) */
public record TrCfInsertReq(@NotNull LocalDate stdDate, @NotBlank String windowClassName) {
}
