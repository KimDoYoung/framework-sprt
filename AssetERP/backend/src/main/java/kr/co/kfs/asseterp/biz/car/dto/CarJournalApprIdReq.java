package kr.co.kfs.asseterp.biz.car.dto;

import jakarta.validation.constraints.NotNull;

/** 차량 운행일지 결재문서 번호 기록 (car.Car05_RelateAppr.updateApprId) */
public record CarJournalApprIdReq(@NotNull Long apprId) {
}
