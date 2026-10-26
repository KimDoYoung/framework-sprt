package kr.co.kfs.asseterp.biz.fnd.dto;

/** 펀드 등록 및 변경 조회 조건 (P05, AS-IS selectByFundName). fundName은 %…%, 유형·클래스구분은 '%'가 전체 */
public record FundSearchCond(Long companyId, String closeYn, String fundName, String fundTypeCode, String classTypeCode) {
}
