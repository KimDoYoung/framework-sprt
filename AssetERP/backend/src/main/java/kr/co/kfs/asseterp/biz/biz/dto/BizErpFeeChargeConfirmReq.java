package kr.co.kfs.asseterp.biz.biz.dto;

import java.util.List;

/** [확정]·[확정취소] (AS-IS biz.Biz55_ErpFeeCharge.confirmUpdate) */
public record BizErpFeeChargeConfirmReq(List<Long> erpFeeChargeIds, boolean fixYn) {
}
