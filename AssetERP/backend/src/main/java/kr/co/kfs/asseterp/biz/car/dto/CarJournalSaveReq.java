package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/**
 * 운행일지 저장 한 행 — journalId가 null이면 신규(AS-IS Car04_Journal.modelUpdate).
 * 주행 전·후 계기판은 받지 않는다(AS-IS Tab.update()가 null로 바꿔 저장한다). 확정·마감 여부는 서버가 정한다
 */
public record CarJournalSaveReq(Long journalId, Long infoId, LocalDate date, Long personId, Long mileage, Long commuteMileage,
                                Long bizMileage, Long unBizMileage, String destination, String reason, String note, Long bookingId) {
}
