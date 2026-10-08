package kr.co.kfs.asseterp.biz.org.mapper;

import kr.co.kfs.asseterp.biz.org.dto.OrgInfoHistRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/org/mapper/org02_info.xml (+ emp03_trans.deleteOrgCheck) */
@Mapper
public interface OrgInfoHistoryMapper {
    /** AS-IS selectByOnlyOrgCodeId */
    List<OrgInfoHistRes> searchInfos(@Param("companyId") Long companyId, @Param("codeId") Long codeId);

    /** AS-IS selectById */
    OrgInfoHistRes selectInfoById(@Param("companyId") Long companyId, @Param("infoId") Long infoId);

    /** AS-IS org02_info.deleteOrgCheck */
    int countChildInfos(@Param("codeId") Long codeId);

    /** AS-IS emp03_trans.deleteOrgCheck */
    int countTrans(@Param("codeId") Long codeId);

    /** AS-IS org02_info.deleteOrg */
    int deleteOrgInfos(@Param("codeId") Long codeId);

    /** AS-IS org01_code.deleteOrg */
    int deleteOrgCode(@Param("companyId") Long companyId, @Param("codeId") Long codeId);

    /** AS-IS Org02_Info.delete (UpdateDataModel DELETE) */
    int deleteInfos(@Param("companyId") Long companyId, @Param("codeId") Long codeId, @Param("infoIds") List<Long> infoIds);
}
