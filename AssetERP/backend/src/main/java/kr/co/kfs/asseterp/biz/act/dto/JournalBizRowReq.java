package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 전표를 만들거나 지울 위 그리드 행 (Act02_JournalModel 중 서버가 읽는 속성) */
public record JournalBizRowReq(Long journalId, Long retireId, String trCode, String note, LocalDate date, String payMonthCode) {
}
