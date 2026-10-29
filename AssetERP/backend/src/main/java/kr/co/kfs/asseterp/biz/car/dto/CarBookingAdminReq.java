package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/** 공용차량 운행변경(관리자) [등록] — 예약과 운행일지를 함께 만든다 (AS-IS updateAdmin / updateListAdmin) */
public record CarBookingAdminReq(Long infoId, Long personId, LocalDate startDate, LocalDate closeDate, String startHour, String startMin,
                                 String closeHour, String closeMin, String destination, String reason, String attendance,
                                 Long mileage, Long commuteMileage, Long bizMileage, Long unBizMileage) {
}
