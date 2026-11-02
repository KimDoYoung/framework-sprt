package kr.co.kfs.asseterp.biz.ast.dto;

/** AS-IS Ast30_BookFundFeeModel — 운용사별 합계(보수원장 현황 왼쪽 그리드) */
public record BookFundFeeCorpRes(Long corpId, String corpCode, String corpName, Long diffFee, Long fee, Long unRcvFee, Long tyFee, Long fixFee) {
}
