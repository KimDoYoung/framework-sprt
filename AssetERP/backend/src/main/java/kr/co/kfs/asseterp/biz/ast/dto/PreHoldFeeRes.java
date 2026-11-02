package kr.co.kfs.asseterp.biz.ast.dto;

/** AS-IS Ast30_BookFundFeeModel — 기준일 전날 보수원장(Ast30_Lookup_HoldFee 목록 행) */
public record PreHoldFeeRes(Long bookFundFeeId, Long corpId, String corpCode, String corpName, String fundCode, String fundName,
                            String curCode, Double forFee, Long fee) {
}
