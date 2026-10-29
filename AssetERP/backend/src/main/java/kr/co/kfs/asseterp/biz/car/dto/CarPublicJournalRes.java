package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/** AS-IS Car04_JournalModel — 공용차량 운행일지(예약 기준 조회). CarJournalRes + 참석자(attendance), infoNm = '차량번호 - 차량명' */
public record CarPublicJournalRes(Long journalId, Long companyId, Long infoId, LocalDate date, Long personId, Long mileage,
                                  Long beforeMileage, Long afterMileage, Long commuteMileage, Long bizMileage, Long unBizMileage,
                                  String destination, String reason, String note, Long bookingId, Boolean fixYn, Boolean closeYn,
                                  Long businessMileage, String infoNm, String attendance) {
}
