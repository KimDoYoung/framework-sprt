package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/** 공용차량 운행변경(관리자) 변경 저장 — 예약(시간·사용자·행선지·목적·참석자)과 운행일지를 함께 고친다 (AS-IS updateJournalModel) */
public record CarBookingJournalReq(Long bookingId, Long journalId, Long infoId, LocalDate date, Long personId, String startHour, String startMin,
                                   String closeHour, String closeMin, Long mileage, Long commuteMileage, Long bizMileage, Long unBizMileage,
                                   String destination, String reason, String attendance, String note) {
}
