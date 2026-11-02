package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 출력 그룹 ID(RD rdGroupId)와 지난주 기간(없으면 null) */
public record WeekPrintRes(String groupId, LocalDate lastStartDate, LocalDate lastCloseDate) {
}
