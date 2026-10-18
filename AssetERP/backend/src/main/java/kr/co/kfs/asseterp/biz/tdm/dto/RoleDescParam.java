package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무기술서 조회 SQL 파라미터 (AS-IS tdm31_role_desc.selectByRegDateAdmin). 일자는 yyyy-MM-dd */
public record RoleDescParam(Long companyId, String startDate, String closeDate, String searchText, boolean endYn, boolean notPeriodYn) {
}
