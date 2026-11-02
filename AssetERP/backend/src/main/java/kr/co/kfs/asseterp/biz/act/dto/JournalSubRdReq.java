package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 계정별원장 출력 준비 — 조회 조건 그대로 */
public record JournalSubRdReq(String windowClassName, LocalDate startDate, LocalDate closeDate, String accountCode,
                              String trCode, Long corpId, Long depositId, String searchText) {
}
