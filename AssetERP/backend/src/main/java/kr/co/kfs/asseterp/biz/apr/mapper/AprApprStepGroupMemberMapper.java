package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupMemberRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr31_appr_step_group_member.xml (EE03 Apr31_Page_ApprStepGroupMember) */
@Mapper
public interface AprApprStepGroupMemberMapper {
    /** AS-IS selectByApprStepGroupId */
    List<AprApprStepGroupMemberRes> selectByApprStepGroupId(@Param("companyId") Long companyId, @Param("apprStepGroupId") Long apprStepGroupId);

    /** 그룹이 이 회사 것인지 (보안 보강) */
    int countGroup(@Param("companyId") Long companyId, @Param("apprStepGroupId") Long apprStepGroupId);

    long selectNextId();

    /** UpdateDataModel UPDATE — 이 그룹의 행만 */
    int update(@Param("apprStepGroupId") Long apprStepGroupId, @Param("id") Long id, @Param("stepTypeCode") String stepTypeCode,
               @Param("seq") String seq, @Param("note") String note, @Param("stepEmpId") Long stepEmpId);

    /** UpdateDataModel INSERT */
    int insert(@Param("apprStepGroupId") Long apprStepGroupId, @Param("id") Long id, @Param("stepTypeCode") String stepTypeCode,
               @Param("seq") String seq, @Param("note") String note, @Param("stepEmpId") Long stepEmpId);

    /** UpdateDataModel.deleteModel — 이 회사 그룹의 행만 */
    int deleteById(@Param("companyId") Long companyId, @Param("id") Long id);
}
