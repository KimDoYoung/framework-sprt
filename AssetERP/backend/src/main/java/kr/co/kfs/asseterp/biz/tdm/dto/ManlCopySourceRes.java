package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 복사 원본 주요관리의무 한 행 (AS-IS Tdm43_ManlModel 중 Tdm43_Lookup_ManlItemRegList·RegList2 위 그리드가 쓰는 속성 —
 * tdm43_manl.selectByRoleId·selectByManlJobId). selectByRoleId는 직책명 열이 없어 roleName이 null이다(원본 그대로).
 */
public record ManlCopySourceRes(Long manlId, Long manlOrgId, Long orgId, Long roleId, String roleName, Long taskId, String taskName,
                                Long taskRelateDetailId, String taskRelateDetailName, Long taskRelateDutyId, String taskRelateDutyName,
                                String orgName, String applyStartDate, String applyEndDate, String jobName) {
}
