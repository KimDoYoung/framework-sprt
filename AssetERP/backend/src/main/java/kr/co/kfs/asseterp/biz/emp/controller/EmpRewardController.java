package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.RewardRes;
import kr.co.kfs.asseterp.biz.emp.dto.RewardSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpRewardService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 상벌내역 탭 (AS-IS Emp11_TabPage_Reward → server/emp/emp11_reward.xml) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpRewardController {

    private final EmpRewardService empRewardService;

    @GetMapping("/persons/{personId}/rewards")
    public ApiResponse<List<RewardRes>> getRewards(@AuthenticationPrincipal UserPrincipal principal,
                                                   @PathVariable Long personId) {
        return ApiResponse.ok(empRewardService.getRewards(principal, personId));
    }

    @PutMapping("/rewards")
    public ApiResponse<List<RewardRes>> updateRewards(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestBody List<RewardSaveReq> rows) {
        return ApiResponse.ok(empRewardService.updateRewards(principal, rows));
    }

    @DeleteMapping("/rewards")
    public ApiResponse<Integer> deleteRewards(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestBody List<Long> rewardIds) {
        return ApiResponse.ok(empRewardService.deleteRewards(principal, rewardIds));
    }
}
