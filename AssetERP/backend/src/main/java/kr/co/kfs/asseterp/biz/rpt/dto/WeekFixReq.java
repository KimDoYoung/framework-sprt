package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 제출(true)·제출취소(false) (AS-IS Rpt03_Week.updateFixYn) */
public record WeekFixReq(LocalDate startDate, LocalDate closeDate, boolean fixYn) {
}
