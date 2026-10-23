package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprPreProvideCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprPreProvideRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDcrWriteRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocSearchCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDocSearchRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprFundDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprFundDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprIcsDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprItemDocListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprItemDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyApproveCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyAuthCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyAuthRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyApproveRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyReferenceCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyReferenceRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyRequestCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprMyRequestRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprPutSealRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateAdvRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateFundRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampSeqCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampSeqRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprSubListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprSubListRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprTotalListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprTotalListRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr01_appr.xml */
@Mapper
public interface AprApprMapper {
    /** AS-IS selectByApprDate L1699 (G06 인감대장) */
    List<AprStampSeqRes> selectByApprDate(@Param("c") AprStampSeqCond cond);

    /** AS-IS updatePutSeal L2874 (G06 [확인자입력]) */
    int updatePutSeal(@Param("apprId") Long apprId, @Param("empId") Long empId, @Param("companyId") Long companyId);

    /** updatePutSeal 뒤 화면에 돌려줄 인감확인자·확인일시 */
    AprPutSealRes selectPutSeal(@Param("apprId") Long apprId);

    /** AS-IS selectByDcrWritePaging L2383 */
    List<AprDcrWriteRes> selectByDcrWritePaging(@Param("c") AprDcrWriteCond cond);

    /** AS-IS selectByDcrWriteTotal L2439 */
    long selectByDcrWriteTotal(@Param("c") AprDcrWriteCond cond);

    /** AS-IS selectByClassTreeId2 L139 (F02, admin=false) */
    List<AprDocRes> selectByClassTreeId2(@Param("c") AprDocListCond cond);

    /** AS-IS apr03_relate_fund.selectByIcsClassTreeId L106 (F03, admin=false) */
    /** AS-IS apr01_appr.selectByText2 (F05 통합 문서검색) */
    List<AprDocSearchRes> selectByText2(@Param("c") AprDocSearchCond cond);

    List<AprIcsDocRes> selectByIcsClassTreeId(@Param("c") AprIcsDocListCond cond);

    /** AS-IS apr01_appr.selectApprListByEmpId L1119 (G01 결재내역 조회) */
    List<AprMyApproveRes> selectApprListByEmpId(@Param("c") AprMyApproveCond cond);

    /** AS-IS apr01_appr.selectByRequestEmpId (G02 상신내역 조회) */
    List<AprMyRequestRes> selectByRequestEmpId(@Param("c") AprMyRequestCond cond);

    /** AS-IS apr01_appr.selectByText L327 (L06 이익제공 사전승인신청) — preProvideRcvApprYn=true 가지 */
    List<AprPreProvideRes> selectPreProvide(@Param("c") AprPreProvideCond cond);

    /** AS-IS apr01_appr.selectByReferenceEmpId (G03 참조내역 조회) */
    List<AprMyReferenceRes> selectByReferenceEmpId(@Param("c") AprMyReferenceCond cond);

    /** AS-IS apr01_appr.selectByAuthEmpId (G04 공람내역 조회) */
    List<AprMyAuthRes> selectByAuthEmpId(@Param("c") AprMyAuthCond cond);

    /** AS-IS apr01_appr.selectByTotalList (G16 운영현황표) */
    List<AprTotalListRes> selectByTotalList(@Param("c") AprTotalListCond cond);

    /** AS-IS apr01_appr.selectBySubList (G17 건별명세) */
    List<AprSubListRes> selectBySubList(@Param("c") AprSubListCond cond);

    /** AS-IS apr01_appr.selectByFundDocList (F06 펀드별 문서검색) */
    List<AprFundDocRes> selectByFundDocList(@Param("c") AprFundDocListCond cond);

    /** AS-IS apr01_appr.selectByItemDocList (F07 종목별 문서검색) */
    List<AprItemDocRes> selectByItemDocList(@Param("c") AprItemDocListCond cond);

    /** AS-IS apr03_relate_fund.selectByApprId (F02) */
    List<AprRelateFundRes> selectRelateFunds(@Param("apprId") Long apprId);

    /** AS-IS apr12_relate_adv.selectByApprId (F02) */
    List<AprRelateAdvRes> selectRelateAdvs(@Param("apprId") Long apprId);
}
