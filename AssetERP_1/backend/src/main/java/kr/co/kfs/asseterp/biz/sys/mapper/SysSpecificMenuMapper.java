package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys50_specific_menu.xml (selectBySpecificWorkCode, selectById) + UpdateDataModel(sys50_specific_menu) */
@Mapper
public interface SysSpecificMenuMapper {
    List<SpecificMenuRes> selectBySpecificWorkCode(@Param("companyId") Long companyId, @Param("specificWorkCd") String specificWorkCd);

    SpecificMenuRes selectById(@Param("specificMenuId") Long specificMenuId);

    Long selectNextId();

    int insertSpecificMenu(@Param("specificMenuId") Long specificMenuId, @Param("companyId") Long companyId, @Param("req") SpecificMenuSaveReq req);

    int updateSpecificMenu(@Param("companyId") Long companyId, @Param("req") SpecificMenuSaveReq req);

    int deleteSpecificMenus(@Param("companyId") Long companyId, @Param("specificMenuIds") List<Long> specificMenuIds);
}
