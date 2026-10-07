package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.MenuRow;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** B06: 프레임 메뉴 트리만 (OMS SysMenuMapper에서 가져옴). 메뉴 관리 화면 SQL은 해당 A에서 추가한다 */
@Mapper
public interface SysMenuMapper {
    /** 회사관리자: 회사 메뉴(sys03_company_menu) 중 parentId의 하위 메뉴 */
    List<MenuRow> searchHeaderMenusByCompany(MenuSearchParam param);

    /** 사원: 권한그룹(sys05_user_role) + 회사 기본 권한그룹(sys04_default_role) 메뉴 중 parentId의 하위 메뉴 */
    List<MenuRow> searchHeaderMenusByUser(MenuSearchParam param);

    /** 회사관리자: parentId 아래 모든 깊이의 회사 메뉴 */
    List<MenuRow> searchTailMenusByCompany(MenuSearchParam param);

    /** 사원: parentId의 손자 메뉴(3차) 중 권한이 있는 메뉴 */
    List<MenuRow> searchTailMenusByUser(MenuSearchParam param);
}
