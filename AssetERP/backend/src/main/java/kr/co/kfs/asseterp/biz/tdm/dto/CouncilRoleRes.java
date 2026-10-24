package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 회의체에 연결된 직책 한 행 (AS-IS Tdm22_RoleRelateCnclModel, tdm22_role_relate_cncl.selectByCnclId) */
public record CouncilRoleRes(
        Long roleRelateCnclId,
        Long roleId,
        Long cnclId,
        String roleName,
        String memberType,
        String memberTypeName,
        LocalDate startDate,
        LocalDate endDate) {
}
