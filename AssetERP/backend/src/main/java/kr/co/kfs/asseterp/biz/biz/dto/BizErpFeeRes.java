package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz52_erp_fee.selectByErpContCorpId·selectByStartDate — AssetERP 계약사별 사용료 한 행 (Biz52_Lookup_ErpFee, EE22). 추가요금청구 여부는 'true'/'false' 글자 */
public record BizErpFeeRes(
        Long erpFeeId,
        Long erpContCorpId,
        LocalDate startDate,
        LocalDate closeDate,
        Long erpFee,
        Long dataFee,
        String chargeDay,
        String vatCd,
        String depositDueDay,
        String addFeeSmsYn,
        String addFeeServerYn,
        String addFeeUserYn,
        Long smsBaseCount,
        Long smsAddPrice,
        Long serverBaseUsage,
        Long serverAddUnit,
        Long serverAddPrice,
        Long userBaseCount,
        Long userAddPrice,
        String userCountStdCd,
        String chargeCalcMonthType,
        String chargeDayStr,
        String depositDueDayStr,
        String vatNm,
        String userCountStdStr,
        String chargeCalcMonthTypeNm
) {
}
