package kr.co.kfs.asseterp.biz.ast.dto;

/** 현금흐름 한 건의 요약 (AS-IS Ast04_CfModel 중 Ast04_Lookup_Cf가 보여 주는 값: 구분·거래처·금액·세금·실수령/지급액) */
public record AstCfDetailRes(Long cfId, String trName, String corpName, Long contAmt, Long tax, Long settleAmt) {
}
