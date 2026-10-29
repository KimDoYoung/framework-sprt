package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/** AS-IS Car03_BookingModel (car03_booking + 사용자·차량 이름). time은 selectByList만 채운다 */
public record CarBookingRes(Long bookingId, Long infoId, Long personId, LocalDate startDate, String startHour, String startMin,
                            LocalDate closeDate, String closeHour, String closeMin, String destination, String reason,
                            String attendance, String note, Long parentId, Long regEmpId, String personNm, String infoNm,
                            String time) {
}
