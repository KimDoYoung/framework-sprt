package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuParam;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/Sys03_CompanyMenu.insert(매뉴권한복사)가 쓰는 SQL (sys03_company_menu, sys04_role, sys07_role_menu) */
@Mapper
public interface SysCompanyMenuMapper {
    /** sys03_company_menu.selectByCompanyId — 출발지 회사의 메뉴 ID */
    List<Long> selectMenuIdsByCompany(Long companyId);

    /** sys03_company_menu.selectByMenu — 도착지에 이미 있는지 */
    int countCompanyMenu(CompanyMenuParam param);

    /** sys03_company_menu.insert (use_yn 'true') */
    int insertCompanyMenu(CompanyMenuParam param);

    /** sys04_role.copyRole — 출발지 권한그룹 전체를 도착지 회사로 (중복 검사 없음, AS-IS 그대로) */
    int copyRoles(@Param("inPutCompanyId") Long inPutCompanyId, @Param("outPutCompanyId") Long outPutCompanyId);

    /** sys04_role.selectByCompanyId — 출발지 권한그룹 이름 (sys04_seq 순) */
    List<String> selectRoleNamesByCompany(Long companyId);

    /** sys07_role_menu.selectByRoleName */
    List<RoleMenuRow> selectRoleMenusByRoleName(CompanyMenuParam param);

    /** sys07_role_menu.selectByMenuId — 도착지 같은 이름 권한그룹에 그 메뉴가 있는지 */
    int countRoleMenu(CompanyMenuParam param);

    /** sys04_role.selectByName — 도착지 같은 이름 권한그룹 중 첫 번째(sys04_seq 순)의 ID */
    Long selectFirstRoleIdByName(CompanyMenuParam param);

    /** sys07_role_menu.insert */
    int insertRoleMenu(CompanyMenuParam param);

    Long selectNextId();
}
