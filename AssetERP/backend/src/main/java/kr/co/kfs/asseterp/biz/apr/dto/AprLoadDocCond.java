package kr.co.kfs.asseterp.biz.apr.dto;

/** apr03_relate_fund.selectByClassTreeId·selectBySearch 조건. orgId·personId는 로그인 사용자, searchText는 LIKE 패턴(selectBySearch만) */
public record AprLoadDocCond(Long classTreeId, Long companyId, Long orgId, Long personId, String searchText) {
}
