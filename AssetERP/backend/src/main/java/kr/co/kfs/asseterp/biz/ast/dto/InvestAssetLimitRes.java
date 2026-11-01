package kr.co.kfs.asseterp.biz.ast.dto;

/** 투자한도 현황 한 행(Ast09_Tab_FinanceBookOpr 위 그리드) — ast09_book.selectInvestAssetLimit */
public record InvestAssetLimitRes(Long bookId, String investAssetTypeName, Double limitRate, Long limitAmt, Long evalAmt, Long purAmt,
                                  Double capitalRatio, Long ownerCapital, String ownerCapitalStdYm) {
}
