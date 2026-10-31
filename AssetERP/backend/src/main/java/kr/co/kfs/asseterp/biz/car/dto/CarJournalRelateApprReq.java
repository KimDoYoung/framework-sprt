package kr.co.kfs.asseterp.biz.car.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** 차량 운행일지 상신 행 만들기 (car.Car05_RelateAppr.insert) — stdMonth는 화면의 getCarDate() `yyyy.MM` */
public record CarJournalRelateApprReq(@NotNull Long infoId, @NotBlank String stdMonth) {
}
