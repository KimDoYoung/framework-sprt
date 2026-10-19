package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.MenuSearchRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys06_menu.xml 의 selectByText·selectByTextManager — 화면 찾기 (Sys06_Lookup_SearchMenu) */
@Mapper
public interface SysMenuSearchMapper {
    /** AS-IS selectByText: 사용자 권한·회사 메뉴 안에서 찾고 북마크 ID를 붙인다 */
    List<MenuSearchRes> selectByText(@Param("userId") Long userId, @Param("companyId") Long companyId,
                                     @Param("searchText") String searchText, @Param("menuNameYn") String menuNameYn);

    /** AS-IS selectByTextManager: 관리자(회사 0·회사관리자)용 — 화면번호·경로명·Class명(·화면설명)으로 찾는다 */
    List<MenuSearchRes> selectByTextManager(@Param("userId") Long userId, @Param("companyId") Long companyId,
                                            @Param("searchText") String searchText, @Param("menuNameYn") String menuNameYn);
}
