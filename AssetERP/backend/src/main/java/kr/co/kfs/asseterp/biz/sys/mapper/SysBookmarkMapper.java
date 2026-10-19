package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.BookmarkRes;
import kr.co.kfs.asseterp.biz.sys.dto.BookmarkSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys40_bookmark.xml — 북마크 */
@Mapper
public interface SysBookmarkMapper {
    /** AS-IS selectBySearchText */
    List<BookmarkRes> selectBySearchText(@Param("userId") Long userId, @Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS selectByMenuId: 이미 북마크했는지 */
    List<BookmarkRes> selectByMenuId(@Param("userId") Long userId, @Param("companyId") Long companyId, @Param("menuId") Long menuId);

    /** AS-IS insertMenuId */
    int insertMenuId(@Param("userId") Long userId, @Param("companyId") Long companyId, @Param("menuId") Long menuId);

    /** AS-IS deleteMenuId */
    int deleteMenuId(@Param("userId") Long userId, @Param("companyId") Long companyId, @Param("menuId") Long menuId);

    /** AS-IS deleteAll */
    int deleteAll(@Param("userId") Long userId, @Param("companyId") Long companyId);

    /** UpdateDataModel UPDATE(그룹명·순서) — 사용자·회사 조건을 더했다 */
    int update(@Param("userId") Long userId, @Param("companyId") Long companyId, @Param("req") BookmarkSaveReq req);
}
