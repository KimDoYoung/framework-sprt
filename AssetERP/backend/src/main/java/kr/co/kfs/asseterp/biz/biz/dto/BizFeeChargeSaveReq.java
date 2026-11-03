package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** Biz20_Edit_FeeCharge 저장 — 편집창 입력(청구일자·운용사·계약사·발생보수·청구보수·세금·비고). feeChargeId 는 편집창이 getSeq 로 받은 번호(없는 번호면 INSERT) */
public record BizFeeChargeSaveReq(
        Long feeChargeId,
        LocalDate chargeDate,
        Long corpId,
        Long contCorpId,
        Long occFee,
        Long chargeFee,
        Long tax,
        String note
) {
}
