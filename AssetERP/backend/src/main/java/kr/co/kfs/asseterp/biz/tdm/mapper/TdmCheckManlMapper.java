package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.CheckCompanySetup;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 이행점검 항목 (AS-IS server/tdm Tdm52_ChckManl) */
@Mapper
public interface TdmCheckManlMapper {

    /** AS-IS tdm52_chck_manl.selectByChckOrgId (unspecYn이면 점검자 미지정만) */
    List<CheckManlRes> selectByChckOrgId(@Param("chckOrgId") Long chckOrgId, @Param("unspecYn") boolean unspecYn, @Param("searchText") String searchText);

    /** AS-IS tdm52_chck_manl.updateCheckerId — 로그인 회사 행만 */
    int updateCheckerId(@Param("chckManlId") Long chckManlId, @Param("companyId") Long companyId, @Param("personId") Long personId, @Param("updName") String updName);

    // ---- N22 이행점검 처리 ----

    /** AS-IS tdm52_chck_manl.selectByPersonId (undoneYn이면 점검대기·진행·승인반려만, searchText는 '%글자%' 또는 null) */
    List<CheckManlDetailRes> selectByPersonId(@Param("chckOrgId") Long chckOrgId, @Param("personId") Long personId,
                                              @Param("undoneYn") boolean undoneYn, @Param("searchText") String searchText);

    /** AS-IS tdm52_chck_manl.selectById */
    CheckManlDetailRes selectById(@Param("chckManlId") Long chckManlId);

    /** AS-IS tdm52_chck_manl.selectCheckTargetByCheckerId — procType 1 점검대기 / 2 점검진행·점검완료 */
    List<Long> selectCheckTargetIds(@Param("chckOrgId") Long chckOrgId, @Param("personId") Long personId, @Param("procType") int procType);

    /** AS-IS tdm52_chck_manl.updateByChckManlId — 점검일·결과·의견·상태 */
    int updateByChckManlId(@Param("chckManlId") Long chckManlId, @Param("checkDate") String checkDate, @Param("checkResultCode") String checkResultCode,
                           @Param("checkCmnt") String checkCmnt, @Param("checkStatusCode") String checkStatusCode, @Param("updName") String updName);

    /** AS-IS UpdateDataModel(tdm52_chck_manl) — [저장]. 로그인 회사 행만 */
    int updateContent(@Param("chckManlId") Long chckManlId, @Param("companyId") Long companyId, @Param("checkDate") String checkDate,
                      @Param("checkResultCode") String checkResultCode, @Param("checkCmnt") String checkCmnt, @Param("updName") String updName);

    /** AS-IS tdm52_chck_manl.countEvidFile */
    int countEvidFile(@Param("chckManlId") Long chckManlId);

    /** AS-IS tdm54_chck_insuff.selectByChckManlId 의 ID들 */
    List<Long> selectInsuffIds(@Param("chckManlId") Long chckManlId);

    /** AS-IS tdm54_chck_insuff.deleteById */
    int deleteInsuffById(@Param("chckInsuffId") Long chckInsuffId);

    /** AS-IS tdm54_chck_insuff.deleteByChckManlId */
    int deleteInsuffByChckManlId(@Param("chckManlId") Long chckManlId);

    /** AS-IS tdm59_chck_appr_cmnt.selectByChckManlId 의 승인상태 — 없으면 null */
    String selectApprStatusCode(@Param("chckManlId") Long chckManlId);

    /** AS-IS tdm61_chck_insuff_appr.deleteByChckManlId */
    int deleteInsuffApprByChckManlId(@Param("chckManlId") Long chckManlId);

    /** AS-IS com01_relate_appr.deleteByKeyTableId */
    int deleteRelateApprByKeyTableId(@Param("keyTableId") Long keyTableId);

    /** AS-IS sys10_file.deleteCheck — 점검항목이 직접 가진 업로드 파일 ID */
    List<Long> selectOwnedFileIds(@Param("parentId") Long parentId);

    /** AS-IS tdm64_chck_evid_extr.deleteByTargetId */
    int deleteEvidExtrByTargetId(@Param("targetId") Long targetId);

    /** AS-IS tdm91_company_setup.selectByDate — 설정이 없으면 기본 행(증빙 필수 true, 글자수 제한 없음) */
    CheckCompanySetup selectCompanySetupByDate(@Param("companyId") Long companyId, @Param("stdDate") String stdDate);
}
