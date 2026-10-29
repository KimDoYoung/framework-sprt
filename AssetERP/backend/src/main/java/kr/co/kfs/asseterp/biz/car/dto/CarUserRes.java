package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/** 전용차량 사용자 한 행 (AS-IS Car02_UserModel) */
public record CarUserRes(Long userId, Long infoId, Long personId, String personNm, LocalDate startDate, LocalDate closeDate) {
}
