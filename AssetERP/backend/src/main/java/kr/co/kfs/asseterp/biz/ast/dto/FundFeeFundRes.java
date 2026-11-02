package kr.co.kfs.asseterp.biz.ast.dto;

/** AS-IS ast30_book_fund_fee.selectByCorpId — 환율 및 펀드보수 변경 조회창의 펀드 한 행 */
public record FundFeeFundRes(
        Long bookFundFeeId,
        String fundCode,
        String fundName,
        Double forFee,
        Long fee,
        Double forTyFee,
        Long tyFee,
        Double forFixFee,
        Long fixFee,
        Double fxRate
) {
}
