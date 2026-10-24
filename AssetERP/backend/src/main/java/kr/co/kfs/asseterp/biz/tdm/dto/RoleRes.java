package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 직책 한 행 (AS-IS Tdm20_RoleModel, tdm20_role.selectByDate) */
public record RoleRes(
        Long roleId,
        String roleName,
        String roleType,
        String roleTypeName,
        String roleTypeEtcName,
        String overview,
        String roleRelateTaskCnt,
        String roleRelateCnclCnt,
        String roleRelateOrgCnt,
        Long ceoRoleId,
        String ceoRoleName,
        LocalDate startDate,
        LocalDate endDate,
        String updName,
        String updDateStr) {
}
