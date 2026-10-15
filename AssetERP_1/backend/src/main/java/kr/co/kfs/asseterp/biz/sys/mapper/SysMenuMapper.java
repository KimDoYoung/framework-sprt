package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.MenuRow;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSearchParam;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuLinkRow;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuCopyRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuCopySearchParam;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.MenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.dto.PersonMenuRow;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuTreeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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

    // ── A10 회사별 메뉴맵핑 (AS-IS Sys06_Menu.selectByCompanyIdAll / updateCompanyMenu) ──

    /** AS-IS selectByCompanyIdAll(부모별 반복)을 한 번에: 전체 메뉴 + 그 회사 연결, 부모·sys06_seq·sys06_menu_nm 순 */
    List<CompanyMenuTreeRes> selectCompanyMenuTree(Long companyId);

    /** A11 AS-IS selectByCompanyId(부모별 반복)을 한 번에: 그 회사가 쓰는 메뉴(특정메뉴 제외), 부모·sys06_seq·sys06_menu_nm 순 */
    List<kr.co.kfs.asseterp.biz.sys.dto.MenuViewRes> selectCompanyViewMenus(Long companyId);

    Long selectNextId();

    int insertCompanyMenu(@Param("id") Long id, @Param("companyId") Long companyId, @Param("menuId") Long menuId, @Param("useYn") String useYn);

    int updateCompanyMenuUseYn(@Param("id") Long id, @Param("companyId") Long companyId, @Param("useYn") String useYn);

    CompanyMenuTreeRes selectCompanyMenuNode(@Param("companyId") Long companyId, @Param("menuId") Long menuId);

    // ── A06 권한그룹별 메뉴 맵핑 (AS-IS Sys06_Menu.selectByRoleId / updateRoleMenu) ──

    /** AS-IS selectByRoleId(부모별 반복)를 한 번에: 회사 메뉴(사용) 중 특정메뉴 아닌 것 + 그 권한 연결, 부모·sys06_seq 순 */
    List<RoleMenuTreeRes> selectRoleMenuTree(@Param("companyId") Long companyId, @Param("roleId") Long roleId);

    int insertRoleMenu(@Param("id") Long id, @Param("roleId") Long roleId, @Param("menuId") Long menuId, @Param("useYn") String useYn);

    int updateRoleMenuUseYn(@Param("id") Long id, @Param("roleId") Long roleId, @Param("useYn") String useYn);

    RoleMenuTreeRes selectRoleMenuNode(@Param("roleId") Long roleId, @Param("menuId") Long menuId);

    // ── C04 사원별 메뉴권한(View) (AS-IS Sys06_Menu.selectByPersonId) ──

    /** AS-IS selectUserMenu1Bang: 사원의 권한그룹 + 회사 기본 권한그룹 메뉴. userId는 서비스가 안 넘긴다(AS-IS 그대로 null) */
    List<PersonMenuRow> selectPersonMenus(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("userId") Long userId);

    // ── A09 메뉴 관리 (AS-IS Sys06_Menu.selectByAll / update / delete / getAllMenuList / updateByMenuYn) ──

    /** AS-IS selectByAll(selectByParentId 부모별 반복)을 한 번에: 부모·sys06_seq·sys06_menu_nm 순 */
    List<MenuTreeRes> selectMenuTree();

    MenuTreeRes selectMenuNode(Long menuId);

    /** 화면번호(unique) 중복 — 자기 자신 제외 */
    int countByMenuNo(@Param("menuNo") String menuNo, @Param("menuId") Long menuId);

    int insertMenu(MenuSaveReq req);

    int updateMenu(MenuSaveReq req);

    int deleteMenu(Long menuId);

    List<MenuCopyRes> selectCopyMenus(MenuCopySearchParam param);

    List<kr.co.kfs.asseterp.biz.sys.dto.MenuLookupRes> selectLookupMenus(MenuCopySearchParam param);

    CompanyMenuLinkRow selectCompanyMenuLink(@Param("menuId") Long menuId, @Param("companyId") Long companyId);

    int countCompanyMenuUseYn(@Param("parentId") Long parentId, @Param("companyId") Long companyId);

    int updateCompanyMenuUseYnByMenu(@Param("menuId") Long menuId, @Param("companyId") Long companyId, @Param("useYn") String useYn);
}
