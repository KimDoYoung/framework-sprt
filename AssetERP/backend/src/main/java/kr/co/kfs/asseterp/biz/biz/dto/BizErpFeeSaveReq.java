package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz.Biz52_ErpFee.update — 저장할 한 행. erpFeeId 가 없거나 0 이하면 새 행(서버가 번호를 받아 INSERT) */
public record BizErpFeeSaveReq(
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
        String chargeCalcMonthType
) {
}
