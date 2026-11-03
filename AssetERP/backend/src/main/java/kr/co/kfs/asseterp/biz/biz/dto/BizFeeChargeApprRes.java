package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz20_fee_charge.getHtmlContent — 상신 전 입금계좌 확인과 상신 본문 값 */
public record BizFeeChargeApprRes(
        String corpNm,
        Long occFee,
        Long realChargeFee,
        Long minFee,
        LocalDate occStartDate,
        LocalDate occCloseDate,
        LocalDate firstStartDate,
        String accountNo,
        String bankNm,
        String accountNm
) {
}
