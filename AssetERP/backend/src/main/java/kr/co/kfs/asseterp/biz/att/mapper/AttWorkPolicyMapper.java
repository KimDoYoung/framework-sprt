package kr.co.kfs.asseterp.biz.att.mapper;

import kr.co.kfs.asseterp.biz.att.dto.AttWorkPolicyRes;
import kr.co.kfs.asseterp.biz.att.dto.AttWorkPolicySaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AttWorkPolicyMapper {

    /** AS-IS att01_work_policy.selectByCompanyId */
    List<AttWorkPolicyRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS att01_work_policy.selectById — 저장 결과 한 행 */
    AttWorkPolicyRes selectById(@Param("companyId") Long companyId, @Param("workPolicyId") Long workPolicyId);

    /** AS-IS att01_work_policy.getModel (useYn "true") */
    List<AttWorkPolicyRes> selectActive(@Param("companyId") Long companyId);

    long selectNextId();

    int insert(@Param("companyId") Long companyId, @Param("workPolicyId") Long workPolicyId, @Param("req") AttWorkPolicySaveReq req);

    int update(@Param("companyId") Long companyId, @Param("req") AttWorkPolicySaveReq req);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
