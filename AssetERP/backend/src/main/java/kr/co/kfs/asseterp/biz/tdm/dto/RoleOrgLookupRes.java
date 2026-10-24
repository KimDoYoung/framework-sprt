package kr.co.kfs.asseterp.biz.tdm.dto;

/** 담당부서 조회창 한 행 (AS-IS tdm23_role_relate_org.selectByRoleId, Tdm23_RoleRelateOrgModel) */
public record RoleOrgLookupRes(
        Long roleRelateOrgId,
        Long roleId,
        Long orgId,
        String orgCode,
        String orgName) {
}
