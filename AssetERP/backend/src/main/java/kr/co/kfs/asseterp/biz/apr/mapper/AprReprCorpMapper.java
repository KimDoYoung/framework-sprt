package kr.co.kfs.asseterp.biz.apr.mapper;

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
}
