package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** A73 오후근무 한 건 (AS-IS Att05_PmWorkModel 중 양식에 쓰는 값, V24) */
public record HrLinkPmWorkRow(LocalDate workDate, String reason, String timeStr, Long breakMinutes, String workTimeStr) {
}
