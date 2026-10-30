package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** biz55_erp_fee_charge.selectByChargeDate — AssetERP 사용료 청구 */
public record JournalBizErpFeeRes(Long erpFeeChargeId, Long trId, LocalDate chargeDate, Long corpId, Long astClassTreeId,
                                  Long chargeAmt, Long totalAmt, Long totalVat, Long apprId, String note) {
}
