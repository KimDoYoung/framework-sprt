package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyUseMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuCopyRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuCopySearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuGuideRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuGuideSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuGuideSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.TopMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuItemRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuItemRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.PersonMenuParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.PersonMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuSearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

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

    /** 회사 메뉴 중 parentId 바로 아래 메뉴 + 권한그룹 권한(sys07) */
    List<RoleMenuRes> searchRoleMenus(RoleMenuSearchParam param);

    /** 회사가 사용하는 메뉴 중 parentId 바로 아래 메뉴 (companyId, parentId) */
    List<CompanyUseMenuRes> searchCompanyUseMenus(CompanyMenuSearchParam param);

    Long selectNextId();

    int insertRoleMenu(RoleMenuRow row);

    int updateRoleMenu(RoleMenuRow row);

    /** 메뉴 관리: parentId 바로 아래 메뉴 (전체) */
    List<MenuItemRes> searchMenuItems(Long parentId);

    MenuItemRes selectMenuItem(Long menuId);

    int insertMenuItem(MenuItemRow row);

    int updateMenuItem(MenuItemRow row);

    int deleteMenuItem(Long menuId);

    /** 일괄복사 대상 메뉴 */
    List<MenuCopyRes> searchCopyMenus(MenuCopySearchParam param);

    /** 화면안내: 3차 메뉴 (1차 메뉴·메뉴/화면명 조건) */
    List<MenuGuideRes> searchMenuGuides(MenuGuideSearchParam param);

    /** 화면안내 저장. 반환: 수정 건수 */
    int updateMenuGuide(MenuGuideSaveReq req);

    /** 사용하는 1차 메뉴 */
    List<TopMenuRes> searchTopMenus();

    /** 회사별 메뉴: parentId 바로 아래 전체 메뉴 + 회사 사용 여부 */
    List<CompanyMenuRes> searchCompanyMenus(CompanyMenuSearchParam param);

    /** (companyId, menuId)의 sys03_company_menu_id. 없으면 null */
    Long selectCompanyMenuId(CompanyMenuSearchParam param);

    /** parentId 아래에서 회사가 사용하는 메뉴 수 */
    int countCompanyMenuUse(CompanyMenuSearchParam param);

    int insertCompanyMenu(CompanyMenuRow row);

    /** companyMenuId로 사용여부 변경 */
    int updateCompanyMenu(CompanyMenuRow row);

    /** (companyId, menuId)로 사용여부 변경 */
    int updateCompanyMenuUse(CompanyMenuRow row);

    int deleteCompanyMenus(List<Long> companyMenuIds);

    /** 사원이 쓸 수 있는 메뉴 (권한그룹 + 회사 기본 권한그룹) */
    List<PersonMenuRes> searchPersonMenus(PersonMenuParam param);
}
