package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupSaveReq;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr30_appr_step_group.xml */
@Mapper
public interface AprApprStepGroupMapper {
    /** AS-IS selectByCompanyId */
    List<AprApprStepGroupRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS apr30_appr_step_group.selectById */
    AprApprStepGroupRes selectById(@Param("companyId") Long companyId, @Param("apprStepGroupId") Long apprStepGroupId);

    long selectNextId();

    /** UpdateDataModel INSERT */
    int insert(@Param("companyId") Long companyId, @Param("req") AprApprStepGroupSaveReq req);

    /** UpdateDataModel UPDATE — 이 회사 그룹만 */
    int update(@Param("companyId") Long companyId, @Param("req") AprApprStepGroupSaveReq req);

    /** UpdateDataModel.deleteModel — 이 회사 그룹만 */
    int deleteById(@Param("companyId") Long companyId, @Param("apprStepGroupId") Long apprStepGroupId);
}
