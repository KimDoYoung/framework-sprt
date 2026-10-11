package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.RewardRes;
import kr.co.kfs.asseterp.biz.emp.dto.RewardSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpRewardMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/emp11_reward.xml */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpRewardService {

    private final EmpRewardMapper empRewardMapper;

    public List<RewardRes> getRewards(UserPrincipal user, Long personId) {
        return empRewardMapper.selectRewards(user.getCompanyId(), personId);
    }

    @Transactional
    public List<RewardRes> updateRewards(UserPrincipal user, List<RewardSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> resultIds = new ArrayList<>();
        for (RewardSaveReq req : rows) {
            if (req.rewardId() == null || req.rewardId() <= 0) {
                Long newId = empRewardMapper.selectNextRewardId();
                empRewardMapper.insertReward(newId, companyId, req);
                resultIds.add(newId);
            } else {
                int cnt = empRewardMapper.updateReward(req.rewardId(), companyId, req);
                if (cnt == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(req.rewardId());
            }
        }
        return resultIds.stream().map(empRewardMapper::selectRewardById).toList();
    }

    @Transactional
    public int deleteRewards(UserPrincipal user, List<Long> rewardIds) {
        if (rewardIds == null || rewardIds.isEmpty()) return 0;
        return empRewardMapper.deleteRewards(rewardIds, user.getCompanyId());
    }
}
