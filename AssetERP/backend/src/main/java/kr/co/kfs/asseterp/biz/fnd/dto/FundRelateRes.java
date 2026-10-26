package kr.co.kfs.asseterp.biz.fnd.dto;

/** 펀드별 자산 조회 왼쪽 펀드 목록 한 행 (P09, AS-IS Fnd01_FundCodeModel 중 펀드코드·펀드명) */
public record FundRelateRes(Long fundCodeId, String fundCode, String fundName) {
}
