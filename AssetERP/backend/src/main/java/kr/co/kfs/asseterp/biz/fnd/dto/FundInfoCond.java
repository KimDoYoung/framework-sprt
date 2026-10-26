package kr.co.kfs.asseterp.biz.fnd.dto;

/** 펀드 변경이력(펀드정보) 페이징 조건 (P08, AS-IS fnd02_fund_info.selectByNamePaging) */
public record FundInfoCond(Long companyId, String fundCode, long limit, long offset) {
}
