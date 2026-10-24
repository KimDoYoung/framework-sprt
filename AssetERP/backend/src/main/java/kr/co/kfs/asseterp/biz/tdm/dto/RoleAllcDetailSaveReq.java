package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 책무배분일 저장 한 행 — roleAllcDetailId ≤ 0이면 INSERT (AS-IS Tdm34_RoleAllcDetail.update, UpdateDataModel) */
public record RoleAllcDetailSaveReq(
        Long roleAllcDetailId,
        LocalDate roleAllcDate,
        String regReason,
        String deputyEmpName) {
}
