package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 편집창 [저장] (AS-IS biz.Biz55_ErpFeeCharge.insertUpdate) — 번호가 없으면 새 번호로 INSERT, 있으면 UPDATE. 확정·결재·전표 열은 바꾸지 않는다 */
public record BizErpFeeChargeSaveReq(
        Long erpFeeChargeId,
        Long erpContCorpId,
        String corpNm,
        LocalDate chargeDate,
        LocalDate startDate,
        LocalDate closeDate,
        Long erpFee,
        Long dataFee,
        Long smsCount,
        Long addSmsFee,
        Long serverUsage,
        Long addServerFee,
        Long userCount,
        Long addUserFee,
        Long etcAmt,
        String etcDesc,
        Long totalAmt,
        Long totalVat,
        Long chargeAmt) {
}
