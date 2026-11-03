package kr.co.kfs.asseterp.biz.mrb.dto;

import java.time.LocalDate;

/** AS-IS selectByDateUnion 한 행 — startTime·closeTime은 'yyyy-MM-dd HH:mm:ss' */
public record MrbBookingTimelineRes(Long bookingId, Long empId, String roomCd, LocalDate bookingDate, String empNm, String subject,
                                    String roomNm, String startTime, String closeTime) {
}
