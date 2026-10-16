package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.MenuGuideRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuGuideSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.MenuNameRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys06_menu.xml selectByMenuId + sys00_common.xml selectMenuName + UpdateDataModel(sys06_menu) */
@Mapper
public interface SysMenuGuideMapper {
    /** AS-IS sys00_common.selectMenuName */
    List<MenuNameRes> selectMenuNames();

    /** AS-IS sys06_menu.selectByMenuId (menuId null = 전체, searchText는 LIKE 패턴) */
    List<MenuGuideRes> selectByMenuId(@Param("menuId") Long menuId, @Param("searchText") String searchText);

    int updateNote(@Param("req") MenuGuideSaveReq req);
}
