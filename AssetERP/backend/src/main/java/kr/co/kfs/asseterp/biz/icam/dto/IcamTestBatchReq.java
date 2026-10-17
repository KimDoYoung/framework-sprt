package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** Icam99_Tab_Test.batch()가 BatchMain에 보내던 값: actionCode와 그 작업이 쓰는 날짜·연도 */
public record IcamTestBatchReq(String actionCode, LocalDate stdDate, LocalDate startDate, LocalDate closeDate, String year) {
}
