package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;
import java.util.List;

/** 분개장 출력 준비 — journalIds가 비어 있으면 조회 조건 전체([전체출력/다운로드]), 있으면 그 전표만([출력/다운로드]) */
public record JournalDtlRdReq(String windowClassName, LocalDate startDate, LocalDate closeDate, Long corpId, String searchText,
                              String trCode, String abroType, List<Long> journalIds) {
}
