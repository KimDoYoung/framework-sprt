package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepChildRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepRow;
import kr.co.kfs.asseterp.biz.tdm.dto.ApprStepSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmApprStepMapper {

    /** AS-IS tdm09_appr_step.selectByCompanyId (typeCode 'C') */
    List<ApprStepRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS tdm09_appr_step.selectByParentId (typeCode 'T') */
    List<ApprStepChildRes> selectByParentId(@Param("companyId") Long companyId, @Param("apprStepId") Long apprStepId);

    /** 승인선 행의 키 정보 (없으면 null) */
    ApprStepRow selectRow(@Param("apprStepId") Long apprStepId);

    /** 저장한 직책-부서 행 (이름은 null) */
    ApprStepRes selectSavedById(@Param("apprStepId") Long apprStepId);

    int countChildren(@Param("companyId") Long companyId, @Param("apprStepId") Long apprStepId);

    Long selectNextId();

    int insertStep(@Param("apprStepId") Long apprStepId, @Param("companyId") Long companyId, @Param("row") ApprStepSaveReq row, @Param("updName") String updName);

    int updateStep(@Param("row") ApprStepSaveReq row, @Param("updName") String updName);

    /** AS-IS tdm09_appr_step.updateByParentId */
    int updateChildrenRoleOrg(@Param("apprStepId") Long apprStepId, @Param("roleId") Long roleId, @Param("orgId") Long orgId);

    int insertChild(@Param("apprStepId") Long apprStepId, @Param("companyId") Long companyId, @Param("roleId") Long roleId, @Param("orgId") Long orgId,
                    @Param("parentId") Long parentId, @Param("apprSeq") String apprSeq, @Param("apprEmpId") Long apprEmpId, @Param("updName") String updName);

    int updateSeq(@Param("apprStepId") Long apprStepId, @Param("apprSeq") String apprSeq, @Param("updName") String updName);

    /** AS-IS tdm09_appr_step.deleteByParentId */
    int deleteByParentId(@Param("apprStepId") Long apprStepId);

    int deleteSteps(@Param("companyId") Long companyId, @Param("apprStepIds") List<Long> apprStepIds);
}
