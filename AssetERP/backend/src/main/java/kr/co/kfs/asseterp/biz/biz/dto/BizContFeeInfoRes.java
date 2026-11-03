package kr.co.kfs.asseterp.biz.biz.dto;

/** 저장된 보수정보 — Biz12_FeeInfoModel.getMinFeeStr()·getWithFeeStr() 같은 글자까지 */
public record BizContFeeInfoRes(Long feeInfoId, Long contHistoryId, String minFeeYn, Long manageMinFee, Long advMinFee, Long discrMinFee,
                                String feeChargeType, String feeChargeTypeNm, String withYn, Long withFee, String minFeeStr, String withFeeStr) {
}
