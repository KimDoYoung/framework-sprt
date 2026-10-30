package kr.co.kfs.asseterp.biz.apr.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.AprAltRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprDetailRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprFileRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprFundRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStampApplRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepRow;
import kr.co.kfs.asseterp.biz.apr.dto.AprEmpBrief;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateApprRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateLawRes;

/** 전자결재 문서 열기 (Apr01_Edit_ApprDoc 읽기, V01) */
@Mapper
public interface AprApprDetailMapper {

    /** AS-IS apr01_appr.selectById (회사 조건은 TOBE에서 더함) */
    AprApprDetailRes selectDetail(@Param("apprId") Long apprId, @Param("companyId") Long companyId);

    /** AS-IS apr04_appr_step.selectByApprId */
    List<AprApprStepRow> selectSteps(@Param("apprId") Long apprId);

    /** AS-IS emp00_trans_info.selectOneEmpInfo (baseDate 기준 발령) */
    AprEmpBrief selectEmpBrief(@Param("empId") Long empId, @Param("baseDate") LocalDate baseDate);

    /** AS-IS apr07_alt_appr.selectCountByEmpId */
    int selectAltCount(@Param("personId") Long personId);

    /** AS-IS apr07_alt_appr.selectOneByEmpId */
    AprAltRow selectAltByEmp(@Param("personId") Long personId);

    /** AS-IS apr07_alt_appr.selectOneByOrgEmpId */
    AprAltRow selectAltByOrg(@Param("personId") Long personId, @Param("orgId") Long orgId);

    /** AS-IS apr10_stamp.selectByApprId 중 (부)책임자 */
    Long selectStampSecondEmp(@Param("apprId") Long apprId, @Param("personId") Long personId);

    /** AS-IS apr03_relate_fund.selectByApprId */
    List<AprApprFundRes> selectApprFunds(@Param("apprId") Long apprId);

    /** AS-IS apr12_relate_adv.selectByApprId */
    List<AprApprAdvRes> selectApprAdvs(@Param("apprId") Long apprId);

    /** AS-IS apr21_relate_appr.selectByApprId */
    List<AprRelateApprRes> selectRelateApprs(@Param("apprId") Long apprId);

    /** AS-IS apr20_relate_ics.selectByApprId */
    List<AprRelateLawRes> selectRelateIcs(@Param("apprId") Long apprId);

    /** AS-IS apr22_relate_icr.selectByApprId */
    List<AprRelateLawRes> selectRelateIcr(@Param("apprId") Long apprId);

    /** AS-IS apr16_stamp_doc.selectByApprId (regCheckYn 아님) */
    List<AprApprStampApplRes> selectStampAppls(@Param("apprId") Long apprId);

    /** AS-IS sys10_file.selectByParentId (표지 파일은 목록에서 뺀다 — Apr01_Grid_ApprFile.retrieve L131-139) */
    List<AprApprFileRes> selectApprFiles(@Param("apprId") Long apprId);

    /** AS-IS apr50_bookmark.selectByPublicYn(publicYn = true) — 건수 */
    int countBookmark(@Param("apprId") Long apprId, @Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS apr42_comment.getSize */
    int countComments(@Param("apprId") Long apprId, @Param("companyId") Long companyId);

    /** AS-IS apr41_open_history.insert (loginMode P) */
    int insertOpenHistory(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("apprId") Long apprId);
}
