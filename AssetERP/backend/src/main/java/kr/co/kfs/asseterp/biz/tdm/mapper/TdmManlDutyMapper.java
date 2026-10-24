package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyGroupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyRegParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyRegRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlDutyTaskOrgRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmManlDutyMapper {

    /** 관리의무(tdm41)의 회사 (없으면 null) — 부서 일괄지정의 회사 범위 검사용 */
    Long selectDutyCompanyId(@Param("manlDutyId") Long manlDutyId);

    /** AS-IS tdm41_manl_duty.groupByManlJobId */
    List<ManlDutyGroupRes> groupByManlJobId(@Param("manlJobId") Long manlJobId, @Param("roleId") Long roleId, @Param("taskId") Long taskId);

    /** AS-IS tdm41_manl_duty.selectByTextPagingTotal / selectByTextPaging */
    long selectByTextPagingTotal(ManlDutyParam param);

    List<ManlDutyRes> selectByTextPaging(ManlDutyParam param);

    /** AS-IS tdm41_manl_duty.selectTaskAndOrg */
    List<ManlDutyTaskOrgRes> selectTaskAndOrg(@Param("manlJobId") Long manlJobId, @Param("roleId") Long roleId);

    /** AS-IS tdm44_manl_duty_org.insertCheck(건수) / insert */
    int countDutyOrg(@Param("manlDutyId") Long manlDutyId, @Param("orgId") Long orgId);

    int insertDutyOrg(@Param("manlDutyId") Long manlDutyId, @Param("orgId") Long orgId, @Param("updName") String updName);

    /** AS-IS tdm42_manl_org.countLockByRoleId */
    int countLockByRoleId(@Param("manlJobId") Long manlJobId, @Param("roleId") Long roleId);

    /** AS-IS tdm42_manl_org.selectByNewOrgId (manlOrgId만) */
    Long selectManlOrgId(@Param("manlJobId") Long manlJobId, @Param("roleId") Long roleId, @Param("orgId") Long orgId);

    /** selectTaskAndOrg 행의 exctId(tdm42_exct_id) — 기존 부서의 직책 확정 행에서 읽는다 */
    Long selectExctId(@Param("manlJobId") Long manlJobId, @Param("roleId") Long roleId, @Param("orgId") Long orgId);

    Long selectNextId();

    /** AS-IS tdm42_manl_org.insert (직책-부서 확정 행 하나) */
    int insertManlOrg(@Param("manlOrgId") Long manlOrgId, @Param("companyId") Long companyId, @Param("orgId") Long orgId,
                      @Param("exctId") Long exctId, @Param("roleId") Long roleId, @Param("manlJobId") Long manlJobId, @Param("updName") String updName);

    /** AS-IS tdm43_manl.updateOrgIdByTaskId / tdm44_manl_duty_org.updateOrgIdByTaskId */
    int updateManlOrgByTask(@Param("manlJobId") Long manlJobId, @Param("roleId") Long roleId, @Param("taskId") Long taskId,
                            @Param("orgId") Long orgId, @Param("newOrgId") Long newOrgId, @Param("manlOrgId") Long manlOrgId, @Param("updName") String updName);

    int updateDutyOrgByTask(@Param("manlJobId") Long manlJobId, @Param("roleId") Long roleId, @Param("taskId") Long taskId,
                            @Param("orgId") Long orgId, @Param("newOrgId") Long newOrgId, @Param("updName") String updName);

    /** AS-IS tdm42_manl_org.deleteByTdm43 — 점검항목이 없는 직책-부서 확정 행 정리 */
    int deleteEmptyManlOrgs(@Param("manlJobId") Long manlJobId, @Param("roleId") Long roleId);

    /** AS-IS tdm42_manl_org.confirmChk — 확정된 행 수 / 잠긴 행 수 */
    int countManlOrgs(@Param("manlJobId") Long manlJobId);

    int countLockedManlOrgs(@Param("manlJobId") Long manlJobId);

    /** AS-IS tdm41_manl_duty.countNullOrgId */
    int countNullOrgId(@Param("manlJobId") Long manlJobId);

    /** AS-IS tdm42_manl_org.insertByManlJobId */
    int insertManlOrgsByJob(@Param("manlJobId") Long manlJobId, @Param("companyId") Long companyId, @Param("updName") String updName);

    /** AS-IS tdm44_manl_duty_org.clearEndYn */
    int clearEndYn(@Param("manlJobId") Long manlJobId, @Param("updName") String updName);

    /** 작성시작일(tdm40_start_date) — AS-IS tdm40_manl_job.selectSimpleById 중 쓰는 열 */
    String selectJobStartDate(@Param("manlJobId") Long manlJobId);

    /** AS-IS tdm41_manl_duty.selectByOrgIdPagingTotal / selectByOrgIdPaging (N17 매뉴얼 작성 위 그리드) */
    long selectByOrgIdPagingTotal(ManlDutyRegParam param);

    List<ManlDutyRegRes> selectByOrgIdPaging(ManlDutyRegParam param);

    /** 잠긴(tdm42_lock_yn) 부서 책무매뉴얼 건수 — AS-IS tdm42_manl_org.selectById 결과에서 잠금만 본다 */
    int countLockedByManlOrgId(@Param("manlOrgId") Long manlOrgId);

    /** AS-IS tdm44_manl_duty_org.updateEndYn — endYn이 true면 완료일·완료자도 채운다 */
    int updateDutyOrgEnd(@Param("manlDutyId") Long manlDutyId, @Param("orgId") Long orgId, @Param("endYn") boolean endYn,
                         @Param("empId") Long empId, @Param("updName") String updName);
}
