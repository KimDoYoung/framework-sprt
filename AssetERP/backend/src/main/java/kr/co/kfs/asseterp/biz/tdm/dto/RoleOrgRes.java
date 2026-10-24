package kr.co.kfs.asseterp.biz.tdm.dto;

/** 직책에 연결된 부서 한 행 (AS-IS Tdm23_RoleRelateOrgModel, tdm23_role_relate_org.selectByRoleId). 새 행은 ID ≤ 0 + orgId */
public record RoleOrgRes(
        Long roleRelateOrgId,
        Long roleId,
        Long orgId,
        String orgName) {
}
