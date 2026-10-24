package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 직책 고르기창 한 행 (AS-IS Tdm20_RoleModel, tdm20_role.selectByDate) */
public record CouncilRoleLookupRes(
        Long roleId,
        String roleName,
        String roleTypeName,
        String roleTypeEtcName,
        String overview,
        LocalDate startDate,
        LocalDate endDate) {
}
