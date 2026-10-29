package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/** 차량운행일지 한 행 (AS-IS Car04_JournalModel — 전용차량 운행일지 그리드 + 편집창) */
public record CarJournalRes(Long journalId, Long companyId, Long infoId, LocalDate date, Long personId, Long mileage,
                            Long beforeMileage, Long afterMileage, Long commuteMileage, Long bizMileage, Long unBizMileage,
                            String destination, String reason, String note, Long bookingId, Boolean fixYn, Boolean closeYn,
                            Long businessMileage, String infoNm, String infoPersonNm) {
}
