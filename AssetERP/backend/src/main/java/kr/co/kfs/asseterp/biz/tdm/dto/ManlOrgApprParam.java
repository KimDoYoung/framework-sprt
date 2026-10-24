package kr.co.kfs.asseterp.biz.tdm.dto;

/** 부서별 매뉴얼 보고 조회 조건 (AS-IS tdm.Tdm42_ManlOrg.selectByText 의 Tdm42_Tab_ManlOrgAppr 파라미터). searchText는 LIKE 패턴 */
public record ManlOrgApprParam(Long companyId, Long orgId, String searchText, boolean useYn) {
}
