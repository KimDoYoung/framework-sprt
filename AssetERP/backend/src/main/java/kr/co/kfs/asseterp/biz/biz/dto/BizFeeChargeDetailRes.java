package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz20_fee_charge.selectById — 청구 한 건 (수정창 저장 뒤 다시 읽기, EE21) */
public record BizFeeChargeDetailRes(
        Long feeChargeId,
        Long companyId,
        LocalDate chargeDate,
        Long corpId,
        LocalDate occStartDate,
        LocalDate occCloseDate,
        Long occDays,
        Long occFee,
        LocalDate minStartDate,
        LocalDate minCloseDate,
        Long minDays,
        Long minFee,
        LocalDate withStartDate,
        LocalDate withCloseDate,
        Long withDays,
        Long withFee,
        String targetYn,
        Long chargeFee,
        Long tax,
        String fixYn,
        Long apprId,
        Long trId,
        String note,
        LocalDate calcStartDate,
        LocalDate calcCloseDate,
        Long calcDays,
        Long contCorpId,
        Long realChargeFee,
        String corpCd,
        String corpNm,
        String manageType,
        String aprStatusNm,
        String fixNm,
        String manageTypeNm
) {
}
