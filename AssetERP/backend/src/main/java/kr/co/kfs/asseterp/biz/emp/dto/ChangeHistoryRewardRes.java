package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDateTime;

/** 사원정보 변경조회 > 상벌내역 탭 행 (AS-IS Emp11_RewardModel, emp11_reward.selectByHistory) */
public record ChangeHistoryRewardRes(
        LocalDateTime rewardDt,
        String empKorName,
        String rewardCodeName,
        String rewardGroup,
        String rewardName,
        String rewardDesc,
        String note
) {
}
