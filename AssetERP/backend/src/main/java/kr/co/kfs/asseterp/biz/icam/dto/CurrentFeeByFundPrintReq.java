package kr.co.kfs.asseterp.biz.icam.dto;

/**
 * [1268/1494] 펀드별 발생보수현황 RD 엑셀다운로드 요청 (R06)
 * AS-IS: Sys99_Print.insertRdCurrentFeeByFund
 */
public record CurrentFeeByFundPrintReq(
        String yearText,
        String preYearText
) {
}
