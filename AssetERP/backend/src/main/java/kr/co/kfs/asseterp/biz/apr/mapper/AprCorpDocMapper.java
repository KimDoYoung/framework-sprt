package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRelateRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 법인서류 신청내역·연결문서 (AS-IS server/apr/Apr17_CorpDoc · Apr18_RelateCorpDoc) — EE92 Apr17_Lookup_CorpDoc · EE93 Apr18_Lookup_RelateAppr · EE94 Apr19_Lookup_RelateAppr */
@Mapper
public interface AprCorpDocMapper {

    /** AS-IS apr17_corp_doc.selectByCompanyId */
    List<AprCorpDocRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS apr17_corp_doc.regDateUpdate — 등록일을 오늘로. 로그인 회사의 등록 전 건만 */
    int regDateUpdate(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS apr18_relate_corp_doc.selectByCorpDocId — 로그인 회사의 신청내역만 */
    List<AprCorpDocRelateRes> selectRelatesByCorpDocId(@Param("companyId") Long companyId, @Param("corpDocId") Long corpDocId);

    /** AS-IS apr17_corp_doc.checkByApprId — 이 상신문서가 이미 연결된 신청내역 번호들 */
    List<Long> selectCorpDocIdsByApprId(@Param("apprId") Long apprId);

    int countCorpDoc(@Param("companyId") Long companyId, @Param("corpDocId") Long corpDocId);

    long selectNextId();

    int insertRelate(@Param("relateCorpDocId") long relateCorpDocId, @Param("corpDocId") Long corpDocId, @Param("apprId") Long apprId);

    /** AS-IS Apr18_RelateCorpDoc.delete — 로그인 회사의 신청내역에 붙은 연결만 */
    int deleteRelates(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
