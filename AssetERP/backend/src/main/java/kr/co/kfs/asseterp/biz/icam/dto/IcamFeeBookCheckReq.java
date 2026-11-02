package kr.co.kfs.asseterp.biz.icam.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record IcamFeeBookCheckReq(@NotNull LocalDate stdDate) {
}
