package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 책무배분 등록창 저장 (AS-IS Tdm30_Edit_RoleAllc.update → Tdm30_RoleAllc.modelUpdate + Tdm34_RoleAllcDetail.modelUpdate) */
public record RoleAllcCreateReq(
        Long roleId,
        Long personId,
        boolean addTitleYn,
        LocalDate startDate,
        LocalDate roleAllcDate,
        String regReason,
        String deputyEmpName) {
}
