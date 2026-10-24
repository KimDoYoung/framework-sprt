package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무체계도 작성 조회 SQL 파라미터 (AS-IS tdm32_role_digm.selectByRegDate, N13). 일자는 yyyy-MM-dd */
public record RoleDigmCompanyParam(Long companyId, String startDate, String closeDate, boolean notEndYn, boolean notPeriodYn) {
}
