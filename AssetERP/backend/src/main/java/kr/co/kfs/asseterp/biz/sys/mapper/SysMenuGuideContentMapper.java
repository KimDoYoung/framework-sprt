package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.MenuGuideContentRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SysMenuGuideContentMapper {

    MenuGuideContentRes selectByMenuNo(@Param("companyId") Long companyId, @Param("menuNo") String menuNo);

    long selectNextId();

    int insertContent(@Param("id") Long id, @Param("companyId") Long companyId, @Param("menuId") Long menuId, @Param("content") String content);

    int updateContent(@Param("id") Long id, @Param("companyId") Long companyId, @Param("menuId") Long menuId, @Param("content") String content);
}
