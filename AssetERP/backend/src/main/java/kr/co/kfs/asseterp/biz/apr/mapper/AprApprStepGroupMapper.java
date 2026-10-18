package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr30_appr_step_group.xml */
@Mapper
public interface AprApprStepGroupMapper {
    /** AS-IS selectByCompanyId */
    List<AprApprStepGroupRes> selectByCompanyId(@Param("companyId") Long companyId);
}
