package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무유형 저장 한 행 — ID가 null/0 이하면 신규 */
public record TaskTypeRow(
        Long taskTypeId,
        String taskTypeCode,
        String taskTypeName,
        String useYn
) {
}
