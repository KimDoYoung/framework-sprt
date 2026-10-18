package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무매뉴얼 재생성 조회 조건 (AS-IS tdm.Tdm42_ManlOrg.selectByText 의 화면 파라미터). searchText는 LIKE 패턴 */
public record ManlOrgParam(Long companyId, Long orgId, String searchText, boolean notPeriodYn, String startDate, String closeDate) {
}
