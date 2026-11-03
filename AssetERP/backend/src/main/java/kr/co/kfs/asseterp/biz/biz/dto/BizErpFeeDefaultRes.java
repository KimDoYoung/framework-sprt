package kr.co.kfs.asseterp.biz.biz.dto;

/** biz52_erp_fee.selectDefaultData — 편집창이 기간에 맞춰 채우는 기준값·사용량 (Biz55_Lookup_ErpFeeCharge.defaultSetup). 추가요금 여부는 Boolean */
public record BizErpFeeDefaultRes(
        String vatCd,
        Boolean addFeeSmsYn,
        Boolean addFeeServerYn,
        Boolean addFeeUserYn,
        Long smsBaseCount,
        Long smsAddPrice,
        Long serverBaseUsage,
        Long serverAddUnit,
        Long serverAddPrice,
        Long userBaseCount,
        Long userAddPrice,
        Long erpFee,
        Long dataFee,
        Long smsTotalCount,
        Long serverUsage,
        Long userTotalCount) {
}
