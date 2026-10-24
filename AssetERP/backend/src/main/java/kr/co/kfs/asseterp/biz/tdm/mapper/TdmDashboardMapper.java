package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.DashboardChckOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardCheckEndRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardMyOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardProgressRes;
import kr.co.kfs.asseterp.biz.tdm.dto.DashboardUndoneRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmDashboardMapper {

    /** AS-IS tdm50_chck_job.selectRcntChckJob — 진행 중인 가장 최근 점검년월(yyyy.MM), 없으면 null */
    String selectRcntCheckYm(@Param("companyId") Long companyId);

    /** AS-IS tdm50_chck_job.selectByCheckYm (defaultYn=false) — 그 달 점검 작업 */
    List<DashboardCheckEndRes> selectByCheckYm(@Param("companyId") Long companyId, @Param("checkYm") String checkYm);

    /** AS-IS tdm51_chck_org.selectDashboardProgress */
    List<DashboardProgressRes> selectDashboardProgress(@Param("companyId") Long companyId, @Param("checkYm") String checkYm,
                                                       @Param("stdDate") String stdDate, @Param("statusType") String statusType,
                                                       @Param("exctId") Long exctId, @Param("orgId") Long orgId);

    /** AS-IS tdm51_chck_org.selectDashboardExct */
    List<DashboardChckOrgRes> selectDashboardExct(@Param("companyId") Long companyId, @Param("checkYm") String checkYm,
                                                  @Param("statusType") String statusType, @Param("exctId") Long exctId);

    /** AS-IS tdm51_chck_org.selectDashboardOrg */
    List<DashboardChckOrgRes> selectDashboardOrg(@Param("companyId") Long companyId, @Param("checkYm") String checkYm,
                                                 @Param("statusType") String statusType, @Param("exctId") Long exctId);

    /** AS-IS tdm52_chck_manl.selectDashboardUndone */
    List<DashboardUndoneRes> selectDashboardUndone(@Param("companyId") Long companyId, @Param("checkYm") String checkYm,
                                                   @Param("statusType") String statusType, @Param("exctId") Long exctId,
                                                   @Param("orgId") Long orgId, @Param("retrieveType") String retrieveType);

    /** AS-IS tdm54_chck_insuff.selectDashboardInsuff (서버는 orgId를 SQL에 넘기지 않는다) */
    List<DashboardInsuffRes> selectDashboardInsuff(@Param("companyId") Long companyId, @Param("checkYm") String checkYm,
                                                   @Param("exctId") Long exctId);

    /** AS-IS tdm08_manager_info.checkIsManager */
    int checkIsManager(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("stdDate") String stdDate);

    /** AS-IS tdm30_role_allc.selectByExctId — 행 수 */
    int countRoleAllcByExctId(@Param("companyId") Long companyId, @Param("stdDate") String stdDate, @Param("exctId") Long exctId);

    /** AS-IS LoginUser.getOrgCodeId() · getOrgInfoModel().getKorName() */
    DashboardMyOrgRes selectMyOrg(@Param("companyId") Long companyId, @Param("personId") Long personId);
}
