package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 직책 편집창 저장 (AS-IS Tdm20_Role.modelUpdate, roleId가 없으면 새 직책. reason은 수정(UPDATE)일 때만) */
public record RoleSaveReq(
        Long roleId,
        String roleName,
        String roleType,
        String roleTypeEtcName,
        String overview,
        LocalDate startDate,
        LocalDate endDate,
        Long ceoRoleId,
        String reason) {
}
