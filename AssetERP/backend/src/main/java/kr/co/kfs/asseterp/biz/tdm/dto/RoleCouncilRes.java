package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 직책에 연결된 회의체 한 행 (AS-IS Tdm22_RoleRelateCnclModel, tdm22_role_relate_cncl.selectByRoleId). 새 행은 ID ≤ 0 + cnclId */
public record RoleCouncilRes(
        Long roleRelateCnclId,
        Long roleId,
        Long cnclId,
        String cnclName,
        String memberType,
        String memberTypeName,
        LocalDate startDate,
        LocalDate endDate) {
}
