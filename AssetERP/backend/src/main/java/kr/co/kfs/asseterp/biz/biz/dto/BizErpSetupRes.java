package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz50_erp_setup.selectAll·selectByStartDate — AssetERP 기본설정 한 행 (Biz50_Lookup_ErpSetup, EE22). 메모·메일양식 특수 행은 목록에 나오지 않는다 */
public record BizErpSetupRes(
        Long erpSetupId,
        LocalDate startDate,
        Long smsBaseCount,
        Long smsAddPrice,
        Long serverBaseUsage,
        Long serverAddUnit,
        Long serverAddPrice,
        String chargeDay,
        String vatCd,
        Long userBaseCount,
        Long userAddPrice,
        String depositDueDay,
        String chargeDayStr,
        String depositDueDayStr,
        String vatNm
) {
}
