package kr.co.kfs.asseterp.biz.icam.dto;

/** 종목(주식) 한 줄 (AS-IS Icam20_PriceModel — icam20_price.selectByStdDatePaging, EE99). isin = 종목코드 */
public record IcamPriceStockRes(String isin, String itemName) {
}
