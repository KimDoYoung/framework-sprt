package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuLinkRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuLinkSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys52_specific_menu_link.xml (selectBySpecificWorkCode, selectById) + UpdateDataModel(sys52_specific_menu_link) */
@Mapper
public interface SysSpecificMenuLinkMapper {
    List<SpecificMenuLinkRes> selectBySpecificWorkCode(@Param("companyId") Long companyId, @Param("specificWorkCd") String specificWorkCd);

    SpecificMenuLinkRes selectById(@Param("specificMenuLinkId") Long specificMenuLinkId);

    Long selectNextId();

    int insertSpecificMenuLink(@Param("specificMenuLinkId") Long specificMenuLinkId, @Param("companyId") Long companyId,
                               @Param("req") SpecificMenuLinkSaveReq req);

    int updateSpecificMenuLink(@Param("companyId") Long companyId, @Param("req") SpecificMenuLinkSaveReq req);

    int deleteSpecificMenuLinks(@Param("companyId") Long companyId, @Param("specificMenuLinkIds") List<Long> specificMenuLinkIds);
}
