package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.RoleRes;
import kr.co.kfs.asseterp.biz.sys.dto.RoleSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysRoleService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
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

/** 권한그룹 관리 (AS-IS Sys04_Tab_Role → server/sys/Sys04_Role) */
@RestController
@RequestMapping("/api/v1/sys/roles")
@RequiredArgsConstructor
public class SysRoleController {

    private final SysRoleService sysRoleService;

    /** AS-IS sys.Sys04_Role.selectByName */
    @GetMapping
    public ApiResponse<List<RoleRes>> searchRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(required = false) String roleNm) {
        return ApiResponse.ok(sysRoleService.searchRoles(principal, roleNm));
    }

    /** AS-IS sys.Sys04_Role.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<RoleRes>> updateRoles(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestBody List<RoleSaveReq> rows) {
        return ApiResponse.ok(sysRoleService.updateRoles(principal, rows));
    }

    /** AS-IS sys.Sys04_Role.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> deleteRoles(@AuthenticationPrincipal UserPrincipal principal,
                                            @RequestBody List<Long> roleIds) {
        return ApiResponse.ok(sysRoleService.deleteRoles(principal, roleIds));
    }
}
