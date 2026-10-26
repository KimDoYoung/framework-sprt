package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.FundTermsDetailRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsRevisionRes;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsRevisionSaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsUpdateReq;
import kr.co.kfs.asseterp.biz.fnd.dto.TermsViewRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fnd/mapper/fnd26_terms_detail.xml · fnd25_terms.xml */
@Mapper
public interface FndTermsDetailMapper {
    /** AS-IS selectByTermsId (P07 규약 내용 조회창) — 사용 중인 개정만, 개정회차 내림차순. 규약은 로그인 회사 것만(보안 보강) */
    List<FundTermsDetailRes> selectByTermsId(@Param("termsId") Long termsId, @Param("companyId") Long companyId);

    /** AS-IS fnd26_terms_detail.selectBySearchText (P12 왼쪽 규약 목록) */
    List<TermsRes> selectBySearchText(@Param("companyId") Long companyId, @Param("termsType") String termsType, @Param("searchText") String searchText);

    /** AS-IS fnd26_terms_detail.selectBySearchTextManager (P12 오른쪽 개정 목록). 규약은 로그인 회사 것만(보안 보강) */
    List<TermsRevisionRes> selectBySearchTextManager(@Param("companyId") Long companyId, @Param("termsId") Long termsId, @Param("searchText") String searchText);

    /** AS-IS fnd25_terms.selectBySearchTextManager (P13 펀드규약 조회) — 규약마다 사용 중인 최신 개정 */
    List<TermsViewRes> selectViewBySearchText(@Param("companyId") Long companyId, @Param("termsType") String termsType, @Param("searchText") String searchText);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS fnd26_terms_detail.RevisionNoCheck (originRevisionNo가 있으면 그 회차는 뺀다) */
    int countRevisionNo(@Param("termsId") Long termsId, @Param("revisionNo") Long revisionNo, @Param("originRevisionNo") Long originRevisionNo);

    /** AS-IS fnd25_terms.selectByFundId (originFundId가 있으면 그 펀드는 뺀다) */
    int countByFundId(@Param("fundId") Long fundId, @Param("originFundId") Long originFundId);

    /** 규약이 있으면 그 회사 ID, 없으면 null (UpdateDataModel의 IsNewData + 회사 확인) */
    Long selectTermsCompanyId(@Param("termsId") Long termsId);

    /** 개정이 있으면 그 규약 ID, 없으면 null */
    Long selectTermsIdOfDetail(@Param("termsDetailId") Long termsDetailId);

    int insertTerms(@Param("companyId") Long companyId, @Param("termsId") Long termsId, @Param("req") TermsRevisionSaveReq req, @Param("userName") String userName);

    int updateTermsByRevision(@Param("companyId") Long companyId, @Param("termsId") Long termsId, @Param("req") TermsRevisionSaveReq req, @Param("userName") String userName);

    int updateTerms(@Param("companyId") Long companyId, @Param("termsId") Long termsId, @Param("req") TermsUpdateReq req, @Param("userName") String userName);

    int insertTermsDetail(@Param("termsDetailId") Long termsDetailId, @Param("termsId") Long termsId, @Param("req") TermsRevisionSaveReq req, @Param("userName") String userName);

    int updateTermsDetail(@Param("companyId") Long companyId, @Param("termsDetailId") Long termsDetailId, @Param("termsId") Long termsId, @Param("req") TermsRevisionSaveReq req, @Param("userName") String userName);

    /** AS-IS Fnd26_TermsDetail.delete (deleteModel) — 로그인 회사 규약의 개정만 */
    int deleteRevisions(@Param("companyId") Long companyId, @Param("termsDetailIds") List<Long> termsDetailIds);

    /** AS-IS fnd26_terms_detail.deleteByTermsId */
    int deleteDetailsByTermsId(@Param("termsId") Long termsId);

    /** AS-IS fnd25_terms.deleteByTermsId */
    int deleteTermsById(@Param("termsId") Long termsId);
}
