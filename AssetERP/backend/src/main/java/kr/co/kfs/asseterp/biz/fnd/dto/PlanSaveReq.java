package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 기획일정 저장 한 행 (AS-IS UpdateDataModel(fnd20_plan)). planId가 0 이하면 새 행 */
public record PlanSaveReq(Long planId, Long fundId, Long classTreeId, Long personId, LocalDate startDate, LocalDate dueDate, String note) {
}
