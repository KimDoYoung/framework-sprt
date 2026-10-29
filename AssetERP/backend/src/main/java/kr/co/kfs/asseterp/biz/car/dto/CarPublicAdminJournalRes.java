package kr.co.kfs.asseterp.biz.car.dto;

import java.time.LocalDate;

/** AS-IS Car04_JournalModel — 공용차량 운행변경(관리자) 조회 한 행 (selectByPublicJournalAdmin). datetime = 'yyyy-MM-dd HH:mm ~ HH:mm', weekName = 색 입힌 요일 HTML */
public record CarPublicAdminJournalRes(Long journalId, Long companyId, Long infoId, LocalDate date, Long personId, Long mileage,
                                       Long commuteMileage, Long bizMileage, Long unBizMileage, String destination, String reason,
                                       String note, Long bookingId, Boolean fixYn, Boolean closeYn, Long businessMileage, String infoNm,
                                       String attendance, String datetime, String weekName, String personNm,
                                       String startHour, String startMin, String closeHour, String closeMin) {
}
