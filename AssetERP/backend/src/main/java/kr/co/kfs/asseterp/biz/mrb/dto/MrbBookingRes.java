package kr.co.kfs.asseterp.biz.mrb.dto;

import java.time.LocalDate;

/** AS-IS Mrb01_BookingModel (mrb01_booking + 예약자·회의실 이름). time은 selectByList만 채운다 */
public record MrbBookingRes(Long bookingId, Long empId, String subject, String roomCd, LocalDate bookingDate, LocalDate bookingCloseDate,
                            String startHour, String startMin, String closeHour, String closeMin, String attendance,
                            String forwarding, Long parentId, String empNm, String roomNm, String time) {
}
