package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/**
 * 펀드별 자산 조회 펀드 목록 조건 (P09, AS-IS fnd01_fund_code.selectByCompanyId).
 * fundType이 null이 아니면 ICAM 보유 펀드 중 1:운용펀드·2:판매펀드로 좁힌다(원본은 콤보 "전체"도 그대로 넘긴다)
 */
public record FundRelateCond(Long companyId, Long orgId, LocalDate stdDate, String fundType, String searchText) {
}
