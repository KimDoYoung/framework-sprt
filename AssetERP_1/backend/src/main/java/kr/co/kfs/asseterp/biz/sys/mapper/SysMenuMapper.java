package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.MenuRow;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSearchParam;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuTreeRes;
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
}
