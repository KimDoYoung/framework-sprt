package kr.co.kfs.asseterp.biz.apr.mapper;

import java.time.LocalDateTime;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprBrief;
import kr.co.kfs.asseterp.biz.apr.dto.AprApprSaveReq;

/** 전자결재 상신·임시저장 (AS-IS server/apr/Apr01_Appr.update·deleteByApprId + UpdateDataModel(apr01_appr·apr04_appr_step), V03) */
@Mapper
public interface AprApprWriteMapper {

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** 문서 한 줄 + 문서분류의 광고심사여부 (apr01_appr.selectById 중 쓰기 판단에 필요한 열) */
    AprApprBrief selectBrief(@Param("apprId") Long apprId, @Param("companyId") Long companyId);

    /** 문서분류의 광고심사여부 (새 문서는 아직 apr01_appr에 없어 분류로 본다) */
    String selectAdvertYn(@Param("classTreeId") Long classTreeId);

    /** AS-IS apr01_appr.getDcrIdWord — 문서번호 식별단어(회사의 문서번호 방식이 '2'일 때 상신자 조직의 단어) */
    String selectDcrIdWord(@Param("companyId") Long companyId, @Param("regEmpId") Long regEmpId, @Param("regDate") LocalDateTime regDate);

    /** UpdateDataModel(apr01_appr) 신규 입력 */
    int insertAppr(@Param("apprId") Long apprId, @Param("companyId") Long companyId, @Param("regEmpId") Long regEmpId,
                   @Param("statusCode") String statusCode, @Param("dcrIdWord") String dcrIdWord, @Param("stampSeq") String stampSeq,
                   @Param("req") AprApprSaveReq req);

    /** UpdateDataModel(apr01_appr) 변경 */
    int updateAppr(@Param("apprId") Long apprId, @Param("companyId") Long companyId, @Param("statusCode") String statusCode,
                   @Param("dcrIdWord") String dcrIdWord, @Param("stampSeq") String stampSeq, @Param("req") AprApprSaveReq req);

    /** AS-IS apr04_appr_step.deleteByApprId */
    int deleteStepsByApprId(@Param("apprId") Long apprId);

    /** AS-IS emp60_sign.getSignId — 사용 중인 결재서명 */
    Long selectSignId(@Param("personId") Long personId);

    /** UpdateDataModel(apr04_appr_step) 신규 입력 (결재선을 지우고 다시 넣는다) */
    int insertStep(@Param("apprStepId") Long apprStepId, @Param("apprId") Long apprId, @Param("stepTypeCode") String stepTypeCode,
                   @Param("seq") String seq, @Param("stepStatusCode") String stepStatusCode, @Param("stepEmpId") Long stepEmpId,
                   @Param("apprEmpId") Long apprEmpId, @Param("apprDate") LocalDateTime apprDate, @Param("note") String note,
                   @Param("lockYn") String lockYn, @Param("addEmpId") Long addEmpId, @Param("signId") Long signId);

    /** AS-IS apr03_relate_fund.deleteByApprId */
    int deleteRelateFundsByApprId(@Param("apprId") Long apprId);

    /** AS-IS sys10_file.deleteCheck — 문서에 붙은 파일 수 */
    int countFilesByParentId(@Param("parentId") Long parentId);

    /** AS-IS sys10_file.deleteCheck — 임시저장 문서를 지울 때 함께 지울 첨부 */
    java.util.List<kr.co.kfs.asseterp.biz.apr.dto.AprFileDelRow> selectFilesForDelete(@Param("parentId") Long parentId);

    /** AS-IS sys10_file.deleteByParentId */
    int deleteFilesByParentId(@Param("parentId") Long parentId);
}
