package kr.co.kfs.asseterp.biz.frm.dto;

import java.time.LocalDate;

/** MyPage 일정 박스 예약 한 행 (AS-IS Mrb01_BookingModel — mrb01_booking.selectByBookingDate, buildGrid05 L311-316). type 12010 회의실 / 12020 공용차량 */
public record FrmRelateBookingRes(
        Long rowId,
        Long bookingId,
        Long empId,
        String empName,
        String content,
        String attendance,
        LocalDate bookingDate,
        String time,
        String type,
        String typeName
) {
}
