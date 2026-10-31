package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** A31 일일업무체크 상신 본문의 한 행 (AS-IS DailyCheckListHtmlData가 쓰는 Sch04_ListModel 열 — 마감일·분류·체크항목·결과·체크내용). 생성자 순서 = 매퍼 SELECT 순서 */
public record Sch04LinkRow(Long listId, LocalDate closeDate, String className, String title, String statusName, String note) {
}
