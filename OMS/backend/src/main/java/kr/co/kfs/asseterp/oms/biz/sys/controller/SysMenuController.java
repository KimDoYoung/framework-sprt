package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuBulkReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuUse;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuCopyRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuItemRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuItemSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.PersonMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleMenuUse;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysMenuService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sys")
@RequiredArgsConstructor
public class SysMenuController {

    private final SysMenuService sysMenuService;

    /** 로그인 사용자의 메뉴 트리 (1차 → 2차 → 3차) */
    @GetMapping("/menus")
    public ApiResponse<List<MenuRes.Level1>> getMenus(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(sysMenuService.getMenus(principal));
    }

    /** 권한그룹별 메뉴 트리 (AS-IS Sys07_Tab_RoleMenu → sys.Sys06_Menu.selectByRoleId) */
    @GetMapping("/role-menus")
    public ApiResponse<List<RoleMenuRes>> searchRoleMenus(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam Long roleId) {
        return ApiResponse.ok(sysMenuService.searchRoleMenus(principal, roleId));
    }

    /** 권한그룹별 메뉴 권한 저장 (AS-IS sys.Sys06_Menu.updateRoleMenu) */
    @PutMapping("/role-menus")
    public ApiResponse<List<RoleMenuUse>> updateRoleMenus(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam Long roleId,
                                                          @RequestBody List<RoleMenuUse> rows) {
        return ApiResponse.ok(sysMenuService.updateRoleMenus(principal, roleId, rows));
    }

    // ── 메뉴 관리 (AS-IS Sys06_Tab_Menu) — 전 고객사 공통 데이터라 KFS 관리자(SYSADMIN)만 ──

    @GetMapping("/menu-items")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<MenuItemRes>> searchMenuItems() {
        return ApiResponse.ok(sysMenuService.searchMenuItems());
    }

    @PostMapping("/menu-items")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<MenuItemRes> createMenuItem(@RequestBody MenuItemSaveReq req) {
        return ApiResponse.ok(sysMenuService.createMenuItem(req));
    }

    @PutMapping("/menu-items/{menuId}")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<MenuItemRes> updateMenuItem(@PathVariable Long menuId, @RequestBody MenuItemSaveReq req) {
        return ApiResponse.ok(sysMenuService.updateMenuItem(menuId, req));
    }

    @DeleteMapping("/menu-items/{menuId}")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<Integer> deleteMenuItem(@PathVariable Long menuId) {
        return ApiResponse.ok(sysMenuService.deleteMenuItem(menuId));
    }

    /** 일괄복사 메뉴 목록 (AS-IS getAllMenuList) */
    @GetMapping("/menu-items/copy-candidates")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<MenuCopyRes>> searchCopyMenus(@RequestParam(required = false) String searchText,
                                                         @RequestParam(defaultValue = "false") boolean menuNameYn) {
        return ApiResponse.ok(sysMenuService.searchCopyMenus(searchText, menuNameYn));
    }

    // ── 회사별 메뉴 (AS-IS Sys03_Tab_CompanyMenu, Sys06_Lookup_CopyMulti) ──

    @GetMapping("/company-menus")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<CompanyMenuRes>> searchCompanyMenus(@RequestParam Long companyId) {
        return ApiResponse.ok(sysMenuService.searchCompanyMenus(companyId));
    }

    @PutMapping("/company-menus")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<CompanyMenuUse>> updateCompanyMenus(@RequestParam Long companyId,
                                                                @RequestBody List<CompanyMenuUse> rows) {
        return ApiResponse.ok(sysMenuService.updateCompanyMenus(companyId, rows));
    }

    /** 메뉴 일괄복사: 권한부여(useYn=true) / 권한삭제(false) (AS-IS updateByMenuYn) */
    @PutMapping("/company-menus/bulk")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<Void> updateCompanyMenusBulk(@RequestBody CompanyMenuBulkReq req) {
        sysMenuService.updateCompanyMenusBulk(req);
        return ApiResponse.ok(null);
    }

    /** 사원이 쓸 수 있는 메뉴 (AS-IS Emp00_Tab_RoleMenu → sys.Sys06_Menu.selectByPersonId) */
    @GetMapping("/menus/persons/{personId}")
    public ApiResponse<List<PersonMenuRes>> searchPersonMenus(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long personId) {
        return ApiResponse.ok(sysMenuService.searchPersonMenus(principal, personId));
    }
}
