package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.UserRoleRes;
import kr.co.kfs.asseterp.biz.sys.dto.UserRoleSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysUserRoleService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 권한그룹별 사용자 맵핑 (AS-IS Sys05_Tab_UserRole → server/sys/Sys05_UserRole) */
@RestController
@RequestMapping("/api/v1/sys")
@RequiredArgsConstructor
public class SysUserRoleController {

    private final SysUserRoleService sysUserRoleService;

    /** AS-IS sys.Sys05_UserRole.selectByRoleId */
    @GetMapping("/roles/{roleId}/user-roles")
    public ApiResponse<List<UserRoleRes>> searchUserRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                          @PathVariable Long roleId) {
        return ApiResponse.ok(sysUserRoleService.searchUserRoles(principal, roleId));
    }

    /** AS-IS sys.Sys05_UserRole.update → 저장된 행(요청 순서) */
    @PutMapping("/user-roles")
    public ApiResponse<List<UserRoleRes>> updateUserRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestBody List<UserRoleSaveReq> rows) {
        return ApiResponse.ok(sysUserRoleService.updateUserRoles(principal, rows));
    }

    /** AS-IS sys.Sys05_UserRole.delete → 지운 건수 */
    @DeleteMapping("/user-roles")
    public ApiResponse<Integer> deleteUserRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestBody List<Long> userRoleIds) {
        return ApiResponse.ok(sysUserRoleService.deleteUserRoles(principal, userRoleIds));
    }
}
