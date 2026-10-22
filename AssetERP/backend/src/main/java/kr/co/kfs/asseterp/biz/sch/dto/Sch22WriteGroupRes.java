package kr.co.kfs.asseterp.biz.sch.dto;

/** 작성(담당)그룹 한 행 (AS-IS Sch22_WriteGroupModel, sch22_write_group.selectByCompanyId): 그룹명·확인자 */
public record Sch22WriteGroupRes(Long writeGroupId, String writeGroupName, Long companyId, Long confirmerId, String confirmerName) {
}
