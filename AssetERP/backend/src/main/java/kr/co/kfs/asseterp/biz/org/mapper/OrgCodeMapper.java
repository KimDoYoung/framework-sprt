package kr.co.kfs.asseterp.biz.org.mapper;

import kr.co.kfs.asseterp.biz.org.dto.OrgCodeRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgCodeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/org/mapper/org01_code.xml (+ Org01_Code가 쓰는 org02_info 저장) */
@Mapper
public interface OrgCodeMapper {
    /** AS-IS selectByParentId_1Bang (parentCodeId = 0) */
    List<OrgCodeRes> searchOrgCodes(@Param("companyId") Long companyId, @Param("baseDate") LocalDate baseDate);

    /** AS-IS selectByBaseDate */
    OrgCodeRes selectByBaseDate(@Param("companyId") Long companyId, @Param("codeId") Long codeId, @Param("baseDate") LocalDate baseDate);

    int countCode(@Param("companyId") Long companyId, @Param("codeId") Long codeId);

    int countInfoByModDate(@Param("codeId") Long codeId, @Param("modDate") LocalDate modDate, @Param("infoId") Long infoId);

    /** AS-IS org02_info.selectCountByCodeId */
    long countInfoByCodeId(@Param("codeId") Long codeId);

    /** AS-IS dbConfig.getSeq */
    Long selectNextId();

    int insertInfo(@Param("infoId") Long infoId, @Param("req") OrgCodeSaveReq req);

    int insertInfoHistory(@Param("infoId") Long infoId, @Param("srcInfoId") Long srcInfoId, @Param("req") OrgCodeSaveReq req);

    int updateInfo(@Param("companyId") Long companyId, @Param("req") OrgCodeSaveReq req);

    int insertCode(@Param("companyId") Long companyId, @Param("req") OrgCodeSaveReq req);

    int updateCode(@Param("companyId") Long companyId, @Param("req") OrgCodeSaveReq req);

    int deleteInfo(@Param("companyId") Long companyId, @Param("infoId") Long infoId);

    int deleteCode(@Param("companyId") Long companyId, @Param("codeId") Long codeId);
}
