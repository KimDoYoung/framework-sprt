package kr.co.kfs.asseterp.biz.car.dto;

/**
 * 편집창 사용일자를 고른 뒤 검사 결과 (AS-IS Car04_Lookup_PrivateJournal.checkCloseYn → checkFixYn → checkJournal → checkDate → getBeforeMileage).
 * message가 있으면 그 메시지를 보이고 [저장]을 끈다. 없으면 [저장]을 켜고 beforeMileage(없으면 0)를 쓴다
 */
public record CarJournalDateCheckRes(String message, Long beforeMileage) {
}
