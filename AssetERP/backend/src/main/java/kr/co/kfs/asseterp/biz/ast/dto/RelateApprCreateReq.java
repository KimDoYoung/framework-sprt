package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** 연관문서 등록 (AS-IS ast.Ast80_RelateAppr.insert) — 같은 일자·링크코드가 있으면 지우고 다시 만든다 */
public record RelateApprCreateReq(@NotNull LocalDate date, @NotBlank String linkCode) {
}
