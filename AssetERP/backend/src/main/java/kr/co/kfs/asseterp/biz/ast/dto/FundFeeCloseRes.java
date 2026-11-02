package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS ast30_book_fund_fee.selectEvalFundFee — 펀드보수 결산처리 그리드 한 행(운용사·통화 단위로 묶음). keyId는 조회마다 매기는 순번 */
public record FundFeeCloseRes(
        Long keyId,
        String trName,
        String closeYnName,
        Double forTyFee,
        Long tyFee,
        Long companyId,
        LocalDate holdDate,
        Long corpId,
        String corpCode,
        String corpName,
        Long astClassTreeId,
        String curCode,
        Double fxRate,
        Double forFee,
        Long fee,
        Double forFixFee,
        Long fixFee,
        Long trId,
        String trCode
) {
}
