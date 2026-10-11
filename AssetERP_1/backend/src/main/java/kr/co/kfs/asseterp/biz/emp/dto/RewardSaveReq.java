package kr.co.kfs.asseterp.biz.emp.dto;

/** 상벌내역 저장 요청 */
public record RewardSaveReq(
        Long rewardId,
        Long personId,
        String rewardCd,
        String rewardDt,
        String rewardGroup,
        String rewardNm,
        String rewardDesc,
        String note
) {}
