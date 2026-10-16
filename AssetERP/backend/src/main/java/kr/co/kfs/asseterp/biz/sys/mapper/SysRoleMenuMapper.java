package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuCopyParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** AS-IS server/sys/Sys07_RoleMenu (updateRole / updateMenu)가 쓰는 SQL */
@Mapper
public interface SysRoleMenuMapper {
    /** sys04_role.selectByName — 목적지 회사에 같은 이름 권한그룹 수 (AS-IS는 목록의 size()만 쓴다) */
    int countRolesByName(RoleMenuCopyParam param);

    /** sys04_role.insertRole — 출발지 같은 이름 권한그룹을 목적지 회사로 */
    int insertRole(RoleMenuCopyParam param);

    /** sys06_menu.getMenuId — 메뉴 자신 + 조상 ID */
    List<Long> selectMenuIdWithAncestors(Long menuId);

    /** sys03_company_menu.selectByMenu — 목적지 회사에 그 메뉴 행 수 */
    int countCompanyMenu(RoleMenuCopyParam param);

    /** sys03_company_menu.updateMenu — 목적지 use_yn = 출발지 use_yn */
    int updateCompanyMenu(RoleMenuCopyParam param);

    /** sys03_company_menu.insertMenu — 출발지 행을 목적지로 */
    int insertCompanyMenu(RoleMenuCopyParam param);

    /** sys07_role_menu.selectByMenuId — 목적지 같은 이름 권한그룹에 그 메뉴 행 수 */
    int countRoleMenu(RoleMenuCopyParam param);

    /** sys07_role_menu.updateRoleMenu — 목적지 use_yn = 출발지 use_yn */
    int updateRoleMenu(RoleMenuCopyParam param);

    /** sys07_role_menu.insertRoleMenu — 출발지 행을 목적지 권한그룹으로 */
    int insertRoleMenu(RoleMenuCopyParam param);
}
