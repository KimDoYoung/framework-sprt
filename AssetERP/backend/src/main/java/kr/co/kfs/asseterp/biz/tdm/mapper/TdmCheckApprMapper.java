package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprEndInfoRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprInsuffRecordRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprKey;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprListRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprManlRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprNeighborRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckApprRecordRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** 책무이행점검 승인 (AS-IS server/tdm Tdm59_ChckApprCmnt, Tdm60_ChckManlAppr, Tdm61_ChckInsuffAppr + Tdm52·Tdm54·Tdm55 승인 조회) */
@Mapper
public interface TdmCheckApprMapper {

    /** AS-IS tdm59_chck_appr_cmnt.selectByApprEmpId — chckApprCmntId를 주면 그 한 건만(서버가 다시 읽을 때) */
    List<CheckApprListRes> selectApprs(@Param("companyId") Long companyId, @Param("checkYm") String checkYm, @Param("roleId") Long roleId,
                                       @Param("personId") Long personId, @Param("stdDate") LocalDate stdDate,
                                       @Param("chckApprCmntId") Long chckApprCmntId);

    CheckApprKey selectApprKey(@Param("chckApprCmntId") Long chckApprCmntId);

    /** AS-IS tdm50_chck_job.selectEndInfoByApprEmpId — 점검 작업이 없으면 null */
    CheckApprEndInfoRes selectEndInfo(@Param("companyId") Long companyId, @Param("checkYm") String checkYm);

    /** AS-IS tdm59_chck_appr_cmnt.checkTdmSubmitPossibleYn — 함수 결과 글자('t'·'f' 또는 'Y'·불가 사유) */
    String selectSubmitPossible(@Param("companyId") Long companyId, @Param("checkYm") String checkYm, @Param("roleId") Long roleId,
                                @Param("personId") Long personId, @Param("type") String type);

    CheckApprNeighborRes selectParent(@Param("chckExctId") Long chckExctId, @Param("parentOrgId") Long parentOrgId,
                                      @Param("orgId") Long orgId, @Param("stdDate") LocalDate stdDate);

    CheckApprNeighborRes selectChild(@Param("chckExctId") Long chckExctId, @Param("childOrgId") Long childOrgId,
                                     @Param("stdDate") LocalDate stdDate);

    int countChild(@Param("chckExctId") Long chckExctId, @Param("apprEmpId") Long apprEmpId);

    boolean selectChildApprYn(@Param("chckExctId") Long chckExctId, @Param("personId") Long personId);

    int updateApprStatus(@Param("chckApprCmntId") Long chckApprCmntId, @Param("apprStatusCode") String apprStatusCode);

    /** submitYn은 'true'/'false' 글자 (DB 열이 varchar) */
    int updateSubmit(@Param("chckApprCmntId") Long chckApprCmntId, @Param("submitYn") String submitYn);

    int updateByApprInfo(@Param("chckApprCmntId") Long chckApprCmntId, @Param("apprStatusCode") String apprStatusCode,
                         @Param("apprCmnt") String apprCmnt, @Param("reportCmnt") String reportCmnt);

    int updateExctApprYn(@Param("chckExctId") Long chckExctId, @Param("exctApprYn") String exctApprYn, @Param("updName") String updName);

    List<String> selectUnCheckOrgNames(@Param("companyId") Long companyId, @Param("checkYm") String checkYm, @Param("roleId") Long roleId,
                                       @Param("stdDate") LocalDate stdDate);

    /** AS-IS tdm52_chck_manl.countByChckApprCmntId — unapprovedOnly(statusType 1: 승인되지 않은) / rejectedOnly(statusType 2: 반려된) */
    int countManlByAppr(@Param("chckApprCmntId") Long chckApprCmntId, @Param("personId") Long personId,
                        @Param("unapprovedOnly") boolean unapprovedOnly, @Param("rejectedOnly") boolean rejectedOnly);

    int countInsuffByAppr(@Param("chckApprCmntId") Long chckApprCmntId, @Param("companyId") Long companyId, @Param("roleId") Long roleId,
                          @Param("checkYm") String checkYm, @Param("personId") Long personId,
                          @Param("unapprovedOnly") boolean unapprovedOnly, @Param("rejectedOnly") boolean rejectedOnly);

    /** AS-IS tdm52_chck_manl.selectByChckApprCmntId — chckManlId를 주면 그 한 건, undoneYn은 승인되지 않은 것만, searchText는 '%…%'(없으면 null) */
    List<CheckApprManlRes> selectManls(@Param("chckApprCmntId") Long chckApprCmntId, @Param("companyId") Long companyId,
                                       @Param("personId") Long personId, @Param("chckManlId") Long chckManlId,
                                       @Param("undoneYn") boolean undoneYn, @Param("searchText") String searchText);

    /** AS-IS tdm54_chck_insuff.selectByChckApprCmntId */
    List<CheckApprInsuffRes> selectInsuffs(@Param("chckApprCmntId") Long chckApprCmntId, @Param("companyId") Long companyId,
                                           @Param("stdDate") LocalDate stdDate, @Param("chckInsuffId") Long chckInsuffId,
                                           @Param("undoneYn") boolean undoneYn);

    /** AS-IS tdm55_chck_record.selectByChckApprCmntId — orgId를 주면 그 부서와 그 하위 */
    List<ChckApprRecordRes> selectRecords(@Param("chckApprCmntId") Long chckApprCmntId, @Param("companyId") Long companyId,
                                          @Param("stdDate") LocalDate stdDate, @Param("orgId") Long orgId);

    /** AS-IS tdm54_chck_insuff.selectById */
    CheckApprInsuffRes selectInsuffById(@Param("chckInsuffId") Long chckInsuffId);

    /** AS-IS tdm63_chck_insuff_record.selectBychckInsuffId */
    List<CheckApprInsuffRecordRes> selectInsuffRecords(@Param("chckInsuffId") Long chckInsuffId);

    int updateManlApprById(@Param("chckManlApprId") Long chckManlApprId, @Param("apprStatusCode") String apprStatusCode,
                           @Param("apprCmnt") String apprCmnt);

    int updateManlApprByManlId(@Param("chckManlId") Long chckManlId, @Param("apprStatusCode") String apprStatusCode,
                               @Param("apprCmnt") String apprCmnt);

    int updateInsuffApprById(@Param("chckInsuffApprId") Long chckInsuffApprId, @Param("apprStatusCode") String apprStatusCode,
                             @Param("apprCmnt") String apprCmnt);

    int updateInsuffApprByInsuffId(@Param("chckInsuffId") Long chckInsuffId, @Param("apprStatusCode") String apprStatusCode,
                                   @Param("apprCmnt") String apprCmnt);

    int updateInsuffStatusCode(@Param("chckInsuffId") Long chckInsuffId, @Param("statusCode") String statusCode,
                               @Param("updName") String updName);
}
