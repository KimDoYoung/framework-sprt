package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckExctPdfTarget;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckExctRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckJobRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgManagerRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckRoleRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckStatusRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckOrgRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgForCheckRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 이행점검 작업·임원 승인현황·부서 점검현황 (AS-IS server/tdm Tdm50_ChckJob·Tdm53_ChckExct·Tdm51_ChckOrg·Tdm56_ChckRelateAppr) */
@Mapper
public interface TdmCheckJobMapper {

    /** AS-IS tdm50_chck_job.selectByCheckYm (defaultYn=true 고정: 없는 달이면 새 ID의 빈 작업 한 건) */
    CheckJobRes selectByCheckYm(@Param("companyId") Long companyId, @Param("checkYm") String checkYm);

    /** AS-IS tdm50_chck_job.selectById */
    CheckJobRes selectById(@Param("chckJobId") Long chckJobId);

    /** AS-IS tdm20_role.getCeoRoleList */
    List<CheckRoleRes> selectCeoRoles(@Param("companyId") Long companyId, @Param("checkYm") String checkYm, @Param("baseDate") String baseDate);

    /** AS-IS tdm50_chck_job.countCheckYm — 점검년월 이후 작업 수 */
    int countAfterCheckYm(@Param("companyId") Long companyId, @Param("checkYm") String checkYm);

    int insertJob(@Param("chckJobId") Long chckJobId, @Param("companyId") Long companyId, @Param("checkYm") String checkYm,
                  @Param("checkName") String checkName, @Param("startDate") String startDate, @Param("endDate") String endDate,
                  @Param("updName") String updName);

    int updateJob(@Param("chckJobId") Long chckJobId, @Param("companyId") Long companyId,
                  @Param("checkName") String checkName, @Param("startDate") String startDate, @Param("endDate") String endDate,
                  @Param("updName") String updName);

    /** AS-IS tdm50_chck_job.selectCheckStatus */
    CheckStatusRes selectCheckStatus(@Param("companyId") Long companyId, @Param("checkYm") String checkYm);

    /** AS-IS tdm50_chck_job.selectPreCheckYm */
    String selectPreCheckYm(@Param("companyId") Long companyId, @Param("checkYm") String checkYm);

    /** AS-IS tdm42_manl_org.selectByStdDate */
    List<ManlOrgForCheckRes> selectManlOrgByStdDate(@Param("companyId") Long companyId, @Param("stdDate") String stdDate);

    Long selectNextId();

    int insertChckOrg(@Param("chckOrgId") Long chckOrgId, @Param("companyId") Long companyId, @Param("checkYm") String checkYm,
                      @Param("roleId") Long roleId, @Param("exctId") Long exctId, @Param("orgId") Long orgId,
                      @Param("chckJobId") Long chckJobId, @Param("manlOrgId") Long manlOrgId, @Param("updName") String updName);

    int insertChckManl(@Param("chckOrgId") Long chckOrgId, @Param("companyId") Long companyId, @Param("checkYm") String checkYm,
                       @Param("manlOrgId") Long manlOrgId, @Param("stdDate") String stdDate, @Param("preCheckYm") String preCheckYm,
                       @Param("month") String month, @Param("updName") String updName);

    int insertChckApprStep(@Param("chckOrgId") Long chckOrgId, @Param("companyId") Long companyId, @Param("roleId") Long roleId,
                           @Param("orgId") Long orgId, @Param("updName") String updName);

    int insertChckExct(@Param("chckJobId") Long chckJobId, @Param("updName") String updName);

    int deleteChckApprStep(@Param("companyId") Long companyId, @Param("checkYm") String checkYm);

    int deleteChckExct(@Param("companyId") Long companyId, @Param("checkYm") String checkYm);

    int deleteChckManl(@Param("companyId") Long companyId, @Param("checkYm") String checkYm);

    int deleteChckOrg(@Param("companyId") Long companyId, @Param("checkYm") String checkYm);

    int countUnLockByExctAppr(@Param("chckJobId") Long chckJobId);

    int countUnCheckByChckJobId(@Param("chckJobId") Long chckJobId);

    int updateEndYn(@Param("chckJobId") Long chckJobId, @Param("endYn") boolean endYn, @Param("updName") String updName);

    /** AS-IS tdm51_chck_org.getMessageList (companyId·checkYm·baseDate·chckJobId) — 부서담당자 */
    List<CheckOrgManagerRes> selectMessageList(@Param("companyId") Long companyId, @Param("checkYm") String checkYm,
                                               @Param("baseDate") String baseDate, @Param("chckJobId") Long chckJobId);

    /** AS-IS tdm53_chck_exct.selectByChckJobId */
    List<CheckExctRes> selectExcts(@Param("chckJobId") Long chckJobId, @Param("ceoRoleId") Long ceoRoleId);

    /** AS-IS tdm51_chck_org.selectByRoleId */
    List<ChckOrgRes> selectOrgsByRoleId(@Param("companyId") Long companyId, @Param("checkYm") String checkYm,
                                        @Param("stdDate") String stdDate, @Param("roleId") Long roleId);

    /** 임원 승인현황의 회사 (없으면 null) — 권한 범위 검사용(TOBE 추가) */
    Long selectExctCompanyId(@Param("chckExctId") Long chckExctId);

    /** AS-IS Tdm53_ChckExct.updateLockYn (UpdateDataModel) — 잠금여부 + 변경자·일시 */
    int updateLockYn(@Param("chckExctId") Long chckExctId, @Param("companyId") Long companyId,
                     @Param("lockYn") boolean lockYn, @Param("updName") String updName);

    /** AS-IS sys10_file.deleteById (adminYn=true) — 임원 승인현황에 붙은 관리자 파일(보고서 PDF) 행 */
    int deleteAdminFiles(@Param("parentId") Long parentId);

    /** AS-IS tdm56_chck_relate_appr.selectApprStatus (최근 한 건) */
    CheckApprRes selectApprStatus(@Param("relateTableId") Long relateTableId, @Param("ceoRoleId") Long ceoRoleId);

    /** AS-IS tdm56_chck_relate_appr.selectByCeoRoleId */
    List<CheckApprRes> selectApprs(@Param("relateTableId") Long relateTableId, @Param("ceoRoleId") Long ceoRoleId);

    /** 이행점검보고서 PDF 생성 대상 (Tdm53_ChckExctModel 속성 + 회사 폴더 이름) */
    CheckExctPdfTarget selectPdfTarget(@Param("chckExctId") Long chckExctId);
}
