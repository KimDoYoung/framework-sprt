package kr.co.kfs.asseterp.biz.sch.dto;

/** 작성그룹 저장 (AS-IS Sch22_WriteGroup.update → UpdateDataModel): id가 없거나 0 이하면 새 그룹 */
public record Sch22WriteGroupSaveReq(Long writeGroupId, String writeGroupName, Long confirmerId) {
}
