package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz.Biz50_ErpSetup.update — 저장할 한 행. erpSetupId 가 없거나 0 이하면 새 행(서버가 번호를 받아 INSERT, 메모 구분 note_yn = 'false') */
public record BizErpSetupSaveReq(
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
        String depositDueDay
) {
}
