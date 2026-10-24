package kr.co.kfs.asseterp.biz.tdm.dto;

/** 임원의 기준일 직책배정별 책무배분일과 상신상태 (AS-IS tdm30_role_allc.selectByExctId) */
public record RoleAllcExctRow(
        Long roleAllcDetailId,
        String apprStatusCode) {
}
