package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuUseReq;
import kr.co.kfs.asseterp.biz.sys.dto.MenuCopyRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.MenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuRes;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** B06 프레임 메뉴 트리(OMS SysMenuController에서 가져옴) + 메뉴 관련 A(A06·A07·A08·A09·A10) API */
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

    /** A10 회사별 메뉴맵핑 트리 (AS-IS sys.Sys06_Menu.selectByCompanyIdAll) */
    @GetMapping("/menus/companies/{companyId}")
    public ApiResponse<List<CompanyMenuTreeRes>> getCompanyMenuTree(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @PathVariable Long companyId) {
        return ApiResponse.ok(sysMenuService.getCompanyMenuTree(principal, companyId));
    }

    /** A10 회사별 메뉴맵핑 저장 (AS-IS sys.Sys06_Menu.updateCompanyMenu) → 저장된 행 */
    @PutMapping("/menus/companies/{companyId}")
    public ApiResponse<List<CompanyMenuTreeRes>> updateCompanyMenus(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @PathVariable Long companyId,
                                                                    @RequestBody List<CompanyMenuSaveReq> rows) {
        return ApiResponse.ok(sysMenuService.updateCompanyMenus(principal, companyId, rows));
    }

    /** A06 권한그룹별 메뉴 맵핑 트리 (AS-IS sys.Sys06_Menu.selectByRoleId) — 로그인 회사 */
    @GetMapping("/roles/{roleId}/menus")
    public ApiResponse<List<RoleMenuTreeRes>> getRoleMenuTree(@AuthenticationPrincipal UserPrincipal principal,
                                                              @PathVariable Long roleId) {
        return ApiResponse.ok(sysMenuService.getRoleMenuTree(principal, roleId));
    }

    /** A06 권한그룹별 메뉴 맵핑 저장 (AS-IS sys.Sys06_Menu.updateRoleMenu) → 저장된 행 */
    @PutMapping("/roles/{roleId}/menus")
    public ApiResponse<List<RoleMenuTreeRes>> updateRoleMenus(@AuthenticationPrincipal UserPrincipal principal,
                                                              @PathVariable Long roleId,
                                                              @RequestBody List<RoleMenuSaveReq> rows) {
        return ApiResponse.ok(sysMenuService.updateRoleMenus(principal, roleId, rows));
    }

    /** A08 권한그룹별 메뉴권한 복사·A07 고객사별 메뉴권한 관리 — 고른 회사·권한의 메뉴 트리 (AS-IS sys.Sys06_Menu.selectByRoleId(roleId, companyId)), sys admin만 */
    @GetMapping("/companies/{companyId}/roles/{roleId}/menus")
    public ApiResponse<List<RoleMenuTreeRes>> getCompanyRoleMenuTree(@AuthenticationPrincipal UserPrincipal principal,
                                                                     @PathVariable Long companyId,
                                                                     @PathVariable Long roleId) {
        return ApiResponse.ok(sysMenuService.getCompanyRoleMenuTree(principal, companyId, roleId));
    }

    /** A07 고객사별 메뉴권한 관리 저장 (AS-IS sys.Sys06_Menu.updateRoleMenu) → 저장된 행, sys admin만 */
    @PutMapping("/companies/{companyId}/roles/{roleId}/menus")
    public ApiResponse<List<RoleMenuTreeRes>> updateCompanyRoleMenus(@AuthenticationPrincipal UserPrincipal principal,
                                                                     @PathVariable Long companyId,
                                                                     @PathVariable Long roleId,
                                                                     @RequestBody List<RoleMenuSaveReq> rows) {
        return ApiResponse.ok(sysMenuService.updateCompanyRoleMenus(principal, companyId, roleId, rows));
    }

    /** A09 메뉴 관리 트리 (AS-IS sys.Sys06_Menu.selectByAll) — 전위 순서, sys admin만 */
    @GetMapping("/menus/all")
    public ApiResponse<List<MenuTreeRes>> getMenuTree(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(sysMenuService.getMenuTree(principal));
    }

    /** A09 매뉴 등록 (AS-IS sys.Sys06_Menu.update — 새 행) → 등록된 행 */
    @PostMapping("/menus")
    public ApiResponse<MenuTreeRes> createMenu(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MenuSaveReq req) {
        return ApiResponse.ok(sysMenuService.createMenu(principal, req));
    }

    /** A09 매뉴 수정·이동 (AS-IS sys.Sys06_Menu.update) → 저장된 행 */
    @PutMapping("/menus/{menuId}")
    public ApiResponse<MenuTreeRes> updateMenu(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long menuId,
                                               @RequestBody MenuSaveReq req) {
        return ApiResponse.ok(sysMenuService.updateMenu(principal, menuId, req));
    }

    /** A09 매뉴 삭제 (AS-IS sys.Sys06_Menu.delete) → 지운 건수 */
    @DeleteMapping("/menus/{menuId}")
    public ApiResponse<Integer> deleteMenu(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long menuId) {
        return ApiResponse.ok(sysMenuService.deleteMenu(principal, menuId));
    }

    /** A09 일괄복사 매뉴 목록 (AS-IS sys.Sys06_Menu.getAllMenuList) */
    @GetMapping("/menus/copy-list")
    public ApiResponse<List<MenuCopyRes>> searchCopyMenus(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam(required = false) String searchText,
                                                          @RequestParam(defaultValue = "false") boolean menuNameYn) {
        return ApiResponse.ok(sysMenuService.searchCopyMenus(principal, searchText, menuNameYn));
    }

    /** A15-4 매뉴찾기 조회창 (AS-IS Sys06_Lookup_SelectMulti → sys.Sys06_Menu.getAllMenuList) */
    @GetMapping("/menus/lookup")
    public ApiResponse<List<kr.co.kfs.asseterp.biz.sys.dto.MenuLookupRes>> searchLookupMenus(@AuthenticationPrincipal UserPrincipal principal,
                                                                                            @RequestParam(required = false) String searchText,
                                                                                            @RequestParam(defaultValue = "false") boolean menuNameYn) {
        return ApiResponse.ok(sysMenuService.searchLookupMenus(principal, searchText, menuNameYn));
    }

    /** A09 일괄 권한부여·삭제 (AS-IS sys.Sys06_Menu.updateByMenuYn) */
    @PutMapping("/menus/company-use")
    public ApiResponse<Void> updateCompanyMenuUse(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CompanyMenuUseReq req) {
        sysMenuService.updateCompanyMenuUse(principal, req);
        return ApiResponse.ok(null);
    }
}
