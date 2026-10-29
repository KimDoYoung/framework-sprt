package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/** 예약 저장. bookingId가 null이면 신규. changeUpdate=true(AS-IS [변경])면 같이 만든 하위 예약을 먼저 지운다 */
public record CarBookingSaveReq(Long bookingId, Long infoId, Long personId, LocalDate startDate, String startHour, String startMin,
                                LocalDate closeDate, String closeHour, String closeMin, String destination, String reason,
                                String attendance, String note, Long parentId, Long regEmpId, boolean changeUpdate) {
}
