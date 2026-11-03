package kr.co.kfs.asseterp.biz.biz.dto;

/** biz.Biz12_FeeInfo.modelUpdate — 보수정보 편집창(Biz12_Edit_FeeInfo)의 [저장] */
public record BizContFeeInfoReq(Long feeInfoId, Long contHistoryId, String minFeeYn, Long manageMinFee, Long advMinFee, Long discrMinFee,
                                String feeChargeType, String withYn, Long withFee) {
}
