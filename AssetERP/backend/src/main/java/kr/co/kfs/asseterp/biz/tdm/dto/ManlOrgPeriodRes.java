package kr.co.kfs.asseterp.biz.tdm.dto;

/** 적용기간 중복 검사용 (AS-IS tdm42_manl_org.notManlOrgList 결과 중 검사에 쓰는 속성) */
public record ManlOrgPeriodRes(Long manlOrgId, Long orgId, Long roleId, String startDate, String endDate) {
}
