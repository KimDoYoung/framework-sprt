package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.RoleAdminSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.RoleRes;
import kr.co.kfs.asseterp.biz.sys.dto.RoleSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysRoleService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
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

/** 권한그룹 관리 (AS-IS Sys04_Tab_Role·Sys04_Tab_RoleAdmin → server/sys/Sys04_Role) */
@RestController
@RequestMapping("/api/v1/sys")
@RequiredArgsConstructor
public class SysRoleController {

    private final SysRoleService sysRoleService;

    /** AS-IS sys.Sys04_Role.selectByName */
    @GetMapping("/roles")
    public ApiResponse<List<RoleRes>> searchRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(required = false) String roleNm) {
        return ApiResponse.ok(sysRoleService.searchRoles(principal, roleNm));
    }

    /** AS-IS sys.Sys04_Role.update → 저장된 행(요청 순서) */
    @PutMapping("/roles")
    public ApiResponse<List<RoleRes>> updateRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestBody List<RoleSaveReq> rows) {
        return ApiResponse.ok(sysRoleService.updateRoles(principal, rows));
    }

    /** AS-IS sys.Sys04_Role.delete → 지운 건수 */
    @DeleteMapping("/roles")
    public ApiResponse<Integer> deleteRoles(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestBody List<Long> roleIds) {
        return ApiResponse.ok(sysRoleService.deleteRoles(principal, roleIds));
    }

    // ── A02 Sys04_Tab_RoleAdmin: 고른 고객사의 권한그룹 (sys admin만) ──

    /** AS-IS sys.Sys04_Role.selectByName(roleName '%' — A08은 '%입력값%', companyId) */
    @GetMapping("/companies/{companyId}/roles")
    public ApiResponse<List<RoleRes>> searchCompanyRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                         @PathVariable Long companyId,
                                                         @RequestParam(required = false) String roleNm) {
        return ApiResponse.ok(sysRoleService.searchCompanyRoles(principal, companyId, roleNm));
    }

    /** AS-IS sys.Sys04_Role.update → 저장된 행(요청 순서) */
    @PutMapping("/companies/{companyId}/roles")
    public ApiResponse<List<RoleRes>> updateCompanyRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                         @PathVariable Long companyId,
                                                         @RequestBody List<RoleAdminSaveReq> rows) {
        return ApiResponse.ok(sysRoleService.updateCompanyRoles(principal, companyId, rows));
    }

    /** AS-IS sys.Sys04_Role.delete → 지운 건수 */
    @DeleteMapping("/companies/{companyId}/roles")
    public ApiResponse<Integer> deleteCompanyRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                   @PathVariable Long companyId,
                                                   @RequestBody List<Long> roleIds) {
        return ApiResponse.ok(sysRoleService.deleteCompanyRoles(principal, companyId, roleIds));
    }
}
