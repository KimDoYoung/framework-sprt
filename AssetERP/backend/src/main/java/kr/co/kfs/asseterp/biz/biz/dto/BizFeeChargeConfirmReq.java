package kr.co.kfs.asseterp.biz.biz.dto;

import java.util.List;

/** [확정]/[확정취소] — 대상 청구보수ID 와 확정 여부 */
public record BizFeeChargeConfirmReq(List<Long> feeChargeIds, boolean fixYn) {
}
