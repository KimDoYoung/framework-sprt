package kr.co.kfs.asseterp.biz.ast.dto;

import java.util.List;

/** AS-IS ast.Ast30_BookFundFee.update — 고친 펀드 행(누적보수·외화 누적보수·적용환율). curCode는 행이 속한 통화 */
public record FundFeeFundSaveReq(String curCode, List<Item> items) {

    public record Item(Long bookFundFeeId, Long fee, Double forFee, Double fxRate) {
    }
}
