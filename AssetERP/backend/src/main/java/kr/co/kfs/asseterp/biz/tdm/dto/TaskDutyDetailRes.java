package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 관리의무 등록 위쪽 그리드 한 행 (AS-IS Tdm12_TaskRelateDetailModel, tdm12_task_relate_detail.selectByText) */
public record TaskDutyDetailRes(Long taskRelateDetailId, Long taskId, String taskTypeName, String taskName,
                                LocalDate taskStartDate, LocalDate taskEndDate, String content, String useYn, String dutyCnt) {
}
