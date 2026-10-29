package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/** AS-IS car03_booking.selectByDateUnion 한 행 (시간막대 차트용). startTime·closeTime은 'YYYY-MM-DD HH24:MI:SS' */
public record CarBookingTimelineRes(Long bookingId, Long personId, Long infoId, LocalDate startDate, String personNm,
                                    String destination, String infoNm, String startTime, String closeTime) {
}
