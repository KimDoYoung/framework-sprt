package kr.co.kfs.asseterp.biz.ics.dto;

/** 현황 행의 정렬 순서와 체크대상 (K07, AS-IS sys99_print.selectIcsCheckListStatus 바깥 SELECT) */
public record IcsChecklistStatusOrder(Long checklistId, String content) {
}
