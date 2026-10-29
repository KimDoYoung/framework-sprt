package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprReprCorpLookupRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprReprCorpRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprReprCorpSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AprReprCorpMapper {

    List<AprReprCorpRes> selectByCompanyId(@Param("companyId") Long companyId);

    AprReprCorpRes selectById(@Param("companyId") Long companyId, @Param("reprCorpId") Long reprCorpId);

    long selectNextId();

    int insertReprCorp(@Param("companyId") Long companyId, @Param("r") AprReprCorpSaveReq req);

    int updateReprCorp(@Param("companyId") Long companyId, @Param("r") AprReprCorpSaveReq req);

    int deleteReprCorp(@Param("companyId") Long companyId, @Param("reprCorpId") Long reprCorpId);

    /** apr16_stamp_doc.selectByReprCorpId — 사용이력 건수 */
    int countStampDocByReprCorpId(@Param("reprCorpId") Long reprCorpId);

    /** AS-IS selectByCompanyId (T23 Apr15_Lookup_ReprCorp) — 등록 대표명의(corpRegYn)·사용중(useYn)만, companyAddYn이면 회사 자신을 더한다 */
    List<AprReprCorpLookupRes> selectLookup(@Param("companyId") Long companyId, @Param("companyAddYn") boolean companyAddYn);

    /** AS-IS selectCorpRegYn — 등록 대표명의가 있는 행 수 */
    int countCorpReg(@Param("companyId") Long companyId);
}
