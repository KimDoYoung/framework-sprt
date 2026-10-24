package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 책무배분 수정창 저장 (AS-IS Tdm30_Edit_RoleAllcModify.update → Tdm30_RoleAllc.modelUpdate) */
public record RoleAllcUpdateReq(
        Long roleId,
        Long personId,
        boolean addTitleYn,
        LocalDate startDate,
        LocalDate endDate) {
}
