package kr.co.kfs.asseterp.biz.biz.dto;

import java.util.List;

/** 상신 뒤 결재문서 연결 (AS-IS biz.Biz55_ErpFeeCharge.updateApprId) */
public record BizErpFeeChargeApprReq(Long apprId, List<Long> erpFeeChargeIds) {
}
