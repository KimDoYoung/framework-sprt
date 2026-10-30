package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** biz20_fee_charge.selectByTrCode — 사무관리 최저보수 청구 */
public record JournalBizFeeRes(Long feeChargeId, Long trId, LocalDate chargeDate, Long corpId, Long astClassTreeId, Long chargeFee, Long tax, Long apprId) {
}
