package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 임원별 직책배정 한 행 (AS-IS tdm30_role_allc.selectByText·selectById·notInRoleAllcIdList, Tdm30_RoleAllcModel) */
public record RoleAllcRes(
        Long roleAllcId,
        Long roleId,
        Long personId,
        String roleName,
        String personName,
        boolean addTitleYn,
        LocalDate startDate,
        LocalDate endDate,
        /** 상신중이거나 완료된 임원동의서가 있다 (selectByText·selectById만 채운다) */
        boolean apprYn,
        String updName,
        String updDateStr) {
}
