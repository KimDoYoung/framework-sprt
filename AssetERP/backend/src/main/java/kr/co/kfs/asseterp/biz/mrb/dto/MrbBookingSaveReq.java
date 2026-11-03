package kr.co.kfs.asseterp.biz.mrb.dto;

import java.time.LocalDate;

/** AS-IS Mrb01_BookingModel 저장 요청 + changeUpdateYn. 새 예약의 bookingId는 next-id로 받은 번호 */
public record MrbBookingSaveReq(Long bookingId, Long empId, String subject, String roomCd, LocalDate bookingDate, LocalDate bookingCloseDate,
                                String startHour, String startMin, String closeHour, String closeMin, String attendance,
                                String forwarding, Long parentId, boolean changeUpdate) {
}
