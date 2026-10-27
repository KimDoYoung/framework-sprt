package kr.co.kfs.asseterp.biz.icam.dto;

public record FundPriceRes(
        Long fundBookId,
        String fundCode,
        String fundName,
        String cur,
        Double forPrincipal,
        Double principalDiff,
        Double forStdPrice,
        Double stdPriceDiff,
        Double forTaxPrice,
        Double taxPriceDiff,
        Double forNav,
        Double navDiff
) {
}
