package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.UserRoleSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysUserRoleService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 권한그룹별 사용자 맵핑 (AS-IS Sys05_Tab_UserRole → sys.Sys05_UserRole) */
@RestController
@RequestMapping("/api/v1/sys/user-roles")
@RequiredArgsConstructor
public class SysUserRoleController {

    private final SysUserRoleService sysUserRoleService;

    @GetMapping
    public ApiResponse<List<UserRoleRes>> searchUserRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam Long roleId) {
        return ApiResponse.ok(sysUserRoleService.searchUserRoles(principal, roleId));
    }

    @PutMapping
    public ApiResponse<List<UserRoleRes>> updateUserRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestBody List<UserRoleSaveReq> rows) {
        return ApiResponse.ok(sysUserRoleService.updateUserRoles(principal, rows));
    }

    @DeleteMapping
    public ApiResponse<Integer> deleteUserRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestBody List<Long> userRoleIds) {
        return ApiResponse.ok(sysUserRoleService.deleteUserRoles(principal, userRoleIds));
    }
}
