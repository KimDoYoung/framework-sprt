package kr.co.kfs.asseterp.biz.apr.dto;

/** apr01_appr.selectByItemDocList 조건. companyId·orgId·personId는 로그인 사용자, searchType 1 연관종목만·2 연관종목 운용펀드 포함, searchText는 원문(SQL이 %…%로 감쌈) */
public record AprItemDocListCond(Long astClassTreeId, Long companyId, Long orgId, Long personId, String searchType, String searchText) {
}
