package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무체계도 조회 SQL 파라미터 (AS-IS tdm32_role_digm.selectByRegDateAdmin). 일자는 yyyy-MM-dd */
public record RoleDigmParam(Long companyId, String startDate, String closeDate, boolean endYn, boolean notPeriodYn) {
}
