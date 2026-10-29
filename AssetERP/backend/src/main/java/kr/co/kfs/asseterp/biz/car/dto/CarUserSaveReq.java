package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/** 전용차량 사용자 저장 한 행 — userId가 null이면 신규(AS-IS UpdateDataModel) */
public record CarUserSaveReq(Long userId, Long infoId, Long personId, LocalDate startDate, LocalDate closeDate) {
}
