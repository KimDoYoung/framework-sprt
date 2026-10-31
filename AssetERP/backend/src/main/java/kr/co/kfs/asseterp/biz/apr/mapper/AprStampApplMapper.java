package kr.co.kfs.asseterp.biz.apr.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.AprStampApplMeta;

/** 상신 문서창 날인신청 탭 (AS-IS server/apr/mapper/apr16_stamp_doc.xml + UpdateDataModel(apr16_stamp_doc), apr04_appr_step.checkApprId, V14) */
@Mapper
public interface AprStampApplMapper {

    /** AS-IS apr16_stamp_doc.selectProvideCoByApprId */
    AprStampApplMeta selectMeta(@Param("apprId") Long apprId);

    /** AS-IS apr04_appr_step.checkApprId — 결재한 단계 수 */
    int countApprovedSteps(@Param("apprId") Long apprId);

    long selectNextId();

    int insertStampDoc(@Param("id") Long id, @Param("companyId") Long companyId, @Param("empId") Long empId, @Param("apprId") Long apprId,
                       @Param("applType") String applType, @Param("stampId") Long stampId, @Param("reprCorpId") Long reprCorpId,
                       @Param("docApplQty") Long docApplQty, @Param("stampQty") Long stampQty, @Param("stampOutYn") String stampOutYn);

    /** 이 문서·회사의 줄만 지운다 (UpdateDataModel.deleteModel) */
    int deleteStampDoc(@Param("apprId") Long apprId, @Param("companyId") Long companyId, @Param("stampDocId") Long stampDocId);

    /** AS-IS apr16_stamp_doc.updateByApprId */
    int updateProvide(@Param("apprId") Long apprId, @Param("provideCo") String provideCo, @Param("purpose") String purpose, @Param("note") String note);
}
