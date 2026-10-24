package kr.co.kfs.asseterp.biz.tdm.dto;

/** AS-IS tdm.Tdm31_RoleDesc.selectByRegDate 파라미터 (searchText는 '%…%'로 감싼 값) */
public record RoleDescCompanyParam(Long companyId, String startDate, String closeDate, String searchText, boolean notEndYn, boolean notPeriodYn) {
}
