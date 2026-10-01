package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyRoleSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleUserRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleUserSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysRoleService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 권한그룹 관리 (AS-IS Sys04_Tab_Role → sys.Sys04_Role) */
@RestController
@RequestMapping("/api/v1/sys/roles")
@RequiredArgsConstructor
public class SysRoleController {

    private final SysRoleService sysRoleService;

    @GetMapping
    public ApiResponse<List<RoleRes>> searchRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(required = false) String roleNm) {
        return ApiResponse.ok(sysRoleService.searchRoles(principal, roleNm));
    }

    /** 추가·변경된 행 일괄 저장 → 저장된 행 (요청 순서) */
    @PutMapping
    public ApiResponse<List<RoleRes>> updateRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestBody List<RoleSaveReq> rows) {
        return ApiResponse.ok(sysRoleService.updateRoles(principal, rows));
    }

    /** 체크된 행 삭제 → 삭제 건수 */
    @DeleteMapping
    public ApiResponse<Integer> deleteRoles(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestBody List<Long> roleIds) {
        return ApiResponse.ok(sysRoleService.deleteRoles(principal, roleIds));
    }

    /** 메뉴별 권한그룹 (AS-IS Sys06_Tab_MenuView → sys.Sys04_Role.selectByMenuId) */
    @GetMapping("/menus/{menuId}")
    public ApiResponse<List<RoleRes>> searchRolesByMenu(@AuthenticationPrincipal UserPrincipal principal,
                                                        @PathVariable Long menuId) {
        return ApiResponse.ok(sysRoleService.searchRolesByMenu(principal, menuId));
    }

    // ── 고객사별 권한그룹 관리 (AS-IS Sys04_Tab_RoleAdmin) — 다른 고객사 데이터라 KFS 관리자(SYSADMIN)만 ──

    @GetMapping("/companies/{companyId}")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<RoleRes>> searchCompanyRoles(@PathVariable Long companyId,
                                                         @RequestParam(required = false) String roleNm) {
        return ApiResponse.ok(sysRoleService.searchCompanyRoles(companyId, roleNm));
    }

    @PutMapping("/companies/{companyId}")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<RoleRes>> updateCompanyRoles(@PathVariable Long companyId,
                                                         @RequestBody List<CompanyRoleSaveReq> rows) {
        return ApiResponse.ok(sysRoleService.updateCompanyRoles(companyId, rows));
    }

    @DeleteMapping("/companies/{companyId}")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<Integer> deleteCompanyRoles(@PathVariable Long companyId, @RequestBody List<Long> roleIds) {
        return ApiResponse.ok(sysRoleService.deleteCompanyRoles(companyId, roleIds));
    }

    /** 사원별 권한그룹 (AS-IS Sys05_Tab_PersonRole → sys.Sys04_Role.selectByUserId) */
    @GetMapping("/users/{userId}")
    public ApiResponse<List<RoleUserRes>> searchUserRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                          @PathVariable Long userId) {
        return ApiResponse.ok(sysRoleService.searchUserRoles(principal, userId));
    }

    /** 사원별 권한그룹 부여·해제 (AS-IS sys.Sys04_Role.updateUserRole) → 사원의 권한그룹 목록 */
    @PutMapping("/users/{userId}")
    public ApiResponse<List<RoleUserRes>> updateUserRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                          @PathVariable Long userId,
                                                          @RequestBody List<RoleUserSaveReq> rows) {
        return ApiResponse.ok(sysRoleService.updateUserRoles(principal, userId, rows));
    }
}
