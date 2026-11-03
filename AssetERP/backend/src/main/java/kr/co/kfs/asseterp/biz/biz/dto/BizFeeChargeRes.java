package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz20_fee_charge.selectByChargeDate — 최저보수 청구 목록 한 행 (Biz20_Tab_FeeCharge 그리드, EE21) */
public record BizFeeChargeRes(
        Long feeChargeId,
        String corpNm,
        Long preOccFee,
        Long preRealChargeFee,
        Long occFee,
        Long realChargeFee,
        Long realFeeChargeId,
        String fixNm,
        String aprStatusNm,
        Long companyId,
        LocalDate chargeDate,
        Long corpId,
        String targetYn,
        Long chargeFee,
        Long tax,
        String note,
        String fixYn,
        Long apprId,
        Long contCorpId,
        Long trId,
        Long minFee,
        LocalDate occStartDate,
        LocalDate occCloseDate,
        Long occDays,
        String manageType,
        String manageTypeNm
) {
}
