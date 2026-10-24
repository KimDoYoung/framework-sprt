package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ManlJobParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlJobRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface TdmManlJobMapper {

    /** 매뉴얼 작업의 회사 (없으면 null) — 수정·삭제·생성의 회사 범위 검사용 */
    Long selectCompanyId(@Param("manlJobId") Long manlJobId);

    List<ManlJobRes> selectByText(ManlJobParam param);

    /** 생성에 쓰는 한 행 (AS-IS는 화면의 모델을 보냈지만 TOBE는 저장된 행을 읽는다) */
    ManlJobRes selectById(@Param("manlJobId") Long manlJobId);

    Long selectNextId();

    int insertManlJob(@Param("manlJobId") Long manlJobId, @Param("companyId") Long companyId, @Param("regDate") LocalDate regDate,
                      @Param("jobName") String jobName, @Param("manlApplyStartDate") LocalDate manlApplyStartDate,
                      @Param("roleId") Long roleId, @Param("orgId") Long orgId, @Param("jobReason") String jobReason,
                      @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("updName") String updName);

    int updateManlJob(@Param("manlJobId") Long manlJobId, @Param("companyId") Long companyId, @Param("regDate") LocalDate regDate,
                      @Param("jobName") String jobName, @Param("manlApplyStartDate") LocalDate manlApplyStartDate,
                      @Param("roleId") Long roleId, @Param("orgId") Long orgId, @Param("jobReason") String jobReason,
                      @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("updName") String updName);

    int deleteManlJobs(@Param("companyId") Long companyId, @Param("manlJobIds") List<Long> manlJobIds);

    /** AS-IS tdm41_manl_duty.selectByManlJobId 의 행 수 (tdm41Chk — 작성내역 있음 판단) */
    int countDuties(@Param("manlJobId") Long manlJobId);

    /** AS-IS tdm43_manl.countByManlJobId */
    int countManls(@Param("manlJobId") Long manlJobId);

    /** AS-IS Tdm40_ManlJob.deleteAll 의 네 DELETE (이 순서) */
    int deleteManlsByJob(@Param("manlJobId") Long manlJobId);

    int deleteManlOrgsByJob(@Param("manlJobId") Long manlJobId);

    int deleteDutyOrgsByJob(@Param("manlJobId") Long manlJobId);

    int deleteDutiesByJob(@Param("manlJobId") Long manlJobId);

    /** AS-IS tdm40_manl_job.createDuty */
    int insertDuties(@Param("manlJobId") Long manlJobId, @Param("companyId") Long companyId, @Param("roleId") Long roleId,
                     @Param("manlApplyStartDate") String manlApplyStartDate, @Param("updName") String updName);

    /** AS-IS tdm44_manl_duty_org.createDutyOrg */
    int insertDutyOrgs(@Param("manlJobId") Long manlJobId, @Param("orgId") Long orgId, @Param("updName") String updName);

    /** AS-IS tdm40_manl_job.createDirectManl — DB 함수 f_create_tdm_manual 의 결과('Y'면 성공, 아니면 실패 메시지) */
    String createDirectManl(@Param("jobType") String jobType, @Param("companyId") Long companyId, @Param("manlJobId") Long manlJobId, @Param("updName") String updName);
}
