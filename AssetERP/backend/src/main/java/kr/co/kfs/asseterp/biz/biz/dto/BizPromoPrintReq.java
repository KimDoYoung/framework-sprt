package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdCard) — 서버가 searchText 앞뒤에 %를 붙인다 */
public record BizPromoPrintReq(LocalDate startDate, LocalDate closeDate, String searchText) {
}
