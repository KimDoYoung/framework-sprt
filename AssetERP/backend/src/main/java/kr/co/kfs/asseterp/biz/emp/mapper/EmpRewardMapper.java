package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.RewardRes;
import kr.co.kfs.asseterp.biz.emp.dto.RewardSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/emp11_reward.xml */
@Mapper
public interface EmpRewardMapper {

    List<RewardRes> selectRewards(@Param("companyId") Long companyId, @Param("personId") Long personId);

    RewardRes selectRewardById(@Param("rewardId") Long rewardId);

    Long selectNextRewardId();

    int insertReward(@Param("rewardId") Long rewardId, @Param("companyId") Long companyId, RewardSaveReq req);

    int updateReward(@Param("rewardId") Long rewardId, @Param("companyId") Long companyId, RewardSaveReq req);

    int deleteRewards(@Param("rewardIds") List<Long> rewardIds, @Param("companyId") Long companyId);
}
