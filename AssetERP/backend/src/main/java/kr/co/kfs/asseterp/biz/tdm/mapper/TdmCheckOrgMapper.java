package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprCmntRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStepOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckInsuffTarget;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgBaseRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgStatusRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 부서 점검현황의 확정·승인요청 (AS-IS server/tdm Tdm51_ChckOrg — 부수 SQL은 tdm52·54·55·58·59·60·61 매퍼 XML) */
@Mapper
public interface TdmCheckOrgMapper {

    /** AS-IS tdm51_chck_org.selectByOrgId (personId 가지는 N22용이라 아직 없다) */
    List<CheckOrgStatusRes> selectByOrgId(@Param("companyId") Long companyId, @Param("checkYm") String checkYm, @Param("orgId") Long orgId);

    /** AS-IS tdm51_chck_org.selectById */
    CheckOrgBaseRes selectById(@Param("chckOrgId") Long chckOrgId);

    /** AS-IS tdm50_chck_job.selectCheckStartDate — 'yyyy-MM-dd' */
    String selectCheckStartDate(@Param("chckJobId") Long chckJobId);

    // ---- 확정(updateFix) ----

    /** AS-IS tdm52_chck_manl.countCheckerIdIsNull */
    int countCheckerIdIsNull(@Param("chckOrgId") Long chckOrgId);

    /** AS-IS tdm58_chck_appr_step.checkLastApprEmp — 승인선이 없으면 null */
    String checkLastApprEmp(@Param("chckOrgId") Long chckOrgId);

    /** AS-IS tdm58_chck_appr_step.selectApprOrg — 같은 부서의 승인자가 둘 이상인 부서 ID */
    List<Long> selectDuplicatedApprOrgs(@Param("chckOrgId") Long chckOrgId);

    /** AS-IS tdm58_chck_appr_step.selectRetireEmp — 점검시작일에 퇴직한 승인자·점검자 이름 */
    String selectRetireEmp(@Param("chckOrgId") Long chckOrgId);

    /** AS-IS tdm60_chck_manl_appr.insertByTdm58 */
    int insertManlApprByApprStep(@Param("chckOrgId") Long chckOrgId, @Param("companyId") Long companyId);

    /** AS-IS tdm60_chck_manl_appr.deleteByChckOrgId */
    int deleteManlApprByChckOrgId(@Param("chckOrgId") Long chckOrgId);

    /** AS-IS tdm52_chck_manl.updateCheckStatusByChckOrgId — checkStatusCode가 null이면 비운다 */
    int updateCheckStatusByChckOrgId(@Param("chckOrgId") Long chckOrgId, @Param("checkStatusCode") String checkStatusCode, @Param("updName") String updName);

    /** AS-IS tdm59_chck_appr_cmnt.createTdm59 — 'Y' 또는 실패 사유 */
    String createTdm59(@Param("actionType") String actionType, @Param("chckOrgId") Long chckOrgId);

    // ---- 승인요청(updateApprStatus) ----

    /** AS-IS tdm60_chck_manl_appr.updateApprStatusByChckOrgId */
    int updateManlApprStatusByChckOrgId(@Param("chckOrgId") Long chckOrgId, @Param("checkStatusCode") String checkStatusCode, @Param("apprStatusCode") String apprStatusCode);

    /** AS-IS tdm52_chck_manl.selectByCheckStatusCode — 점검항목 ID만 */
    List<Long> selectChckManlIdsByCheckStatus(@Param("chckOrgId") Long chckOrgId, @Param("checkStatusCode") String checkStatusCode);

    /** AS-IS tdm52_chck_manl.updateCheckStatusById */
    int updateCheckStatusById(@Param("chckManlId") Long chckManlId, @Param("checkStatusCode") String checkStatusCode, @Param("updName") String updName);

    /** AS-IS tdm58_chck_appr_step.selectApprStep */
    List<CheckApprStepOrgRes> selectApprStep(@Param("chckOrgId") Long chckOrgId);

    /** AS-IS tdm59_chck_appr_cmnt.selectByApprOrgId */
    CheckApprCmntRes selectApprCmntByApprOrgId(@Param("chckOrgId") Long chckOrgId, @Param("apprOrgId") Long apprOrgId);

    /** AS-IS tdm59_chck_appr_cmnt.updateApprStatus */
    int updateApprCmntStatus(@Param("chckApprCmntId") Long chckApprCmntId, @Param("apprStatusCode") String apprStatusCode);

    /** AS-IS tdm59_chck_appr_cmnt.updateApprStatusBySubCheckOrg */
    int updateApprCmntStatusBySubCheckOrg(@Param("chckApprCmntId") Long chckApprCmntId, @Param("apprStatusCode") String apprStatusCode, @Param("orgId") Long orgId);

    /** AS-IS tdm61_chck_insuff_appr.deleteByChckOrgId */
    int deleteInsuffApprByChckOrgId(@Param("chckOrgId") Long chckOrgId);

    /** AS-IS tdm61_chck_insuff_appr.insertByTdm58 */
    int insertInsuffApprByApprStep(@Param("chckOrgId") Long chckOrgId);

    /** AS-IS tdm61_chck_insuff_appr.deleteByChckInsuffId */
    int deleteInsuffApprByChckInsuffId(@Param("chckInsuffId") Long chckInsuffId);

    /** AS-IS tdm54_chck_insuff.selectApprTarget */
    List<CheckInsuffTarget> selectInsuffApprTarget(@Param("chckOrgId") Long chckOrgId, @Param("statusCode") String statusCode);

    /** AS-IS tdm54_chck_insuff.updateStatusCode2 */
    int updateInsuffStatus(@Param("chckInsuffId") Long chckInsuffId, @Param("statusCode") String statusCode, @Param("actionApprYm") String actionApprYm, @Param("updName") String updName);
}
