package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무유형 한 행 (AS-IS tdm14_task_type.selectByCompanyId → Tdm14_TaskTypeModel) */
public record TaskTypeRes(
        Long taskTypeId,
        String taskClassCode,
        String taskClassName,
        String taskTypeCode,
        String taskTypeName,
        String useYn
) {
}
