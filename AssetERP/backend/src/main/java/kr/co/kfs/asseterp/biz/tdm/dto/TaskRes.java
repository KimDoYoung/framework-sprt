package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 책무 한 행 (AS-IS tdm10_task.selectByText·selectById → Tdm10_TaskModel) */
public record TaskRes(
        Long taskId,
        String taskClassCode,
        String taskClassName,
        String taskTypeCode,
        String taskTypeName,
        String taskName,
        String commonYn,
        String ceoYn,
        LocalDate startDate,
        LocalDate endDate,
        String updName,
        String updDateStr,
        String taskRelateDetailCntStr,
        Long taskRelateLawCnt,
        Long taskRelateRuleCnt
) {
}
