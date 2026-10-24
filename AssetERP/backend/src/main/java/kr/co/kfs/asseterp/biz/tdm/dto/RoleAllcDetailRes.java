package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 책무배분일 한 행 (AS-IS tdm34_role_allc_detail.selectByRoleAllcId, Tdm34_RoleAllcDetailModel) */
public record RoleAllcDetailRes(
        Long roleAllcDetailId,
        Long roleAllcId,
        LocalDate roleAllcDate,
        String regReason,
        String deputyEmpName,
        /** 임원동의서 상신 ID */
        Long apprId,
        /** 상신상태 코드 (상신 전 '00', 99 임시저장·40 반려·10/20 진행·30 완료) */
        String apprStatusCode,
        String apprStatusName,
        /** 겸직 여부 'Y'/'N' — 'N'일 때만 책무기술서 미리보기 아이콘이 보인다 */
        String addTitleYnStr,
        String updName,
        String updDateStr) {
}
