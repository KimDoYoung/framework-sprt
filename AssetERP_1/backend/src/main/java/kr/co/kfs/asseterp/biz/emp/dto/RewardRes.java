package kr.co.kfs.asseterp.biz.emp.dto;

/** 상벌내역 행 (AS-IS Emp11_RewardModel) */
public record RewardRes(
        Long rewardId,
        Long personId,
        String rewardCd,
        String rewardCdNm,
        String rewardDt,
        String rewardGroup,
        String rewardNm,
        String rewardDesc,
        String note
) {}
