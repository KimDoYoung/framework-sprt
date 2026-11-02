package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 계정원장 출력 준비 — 조회 조건 그대로 */
public record GenLedgerRdReq(String windowClassName, LocalDate stdDate, String diffType, String searchText) {
}
