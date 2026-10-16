package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.RoleMenuCopyReq;
import kr.co.kfs.asseterp.biz.sys.service.SysRoleMenuService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** A08 권한그룹별 메뉴권한 복사 (AS-IS server/sys/Sys07_RoleMenu) */
@RestController
@RequestMapping("/api/v1/sys/role-menus")
@RequiredArgsConstructor
public class SysRoleMenuController {

    private final SysRoleMenuService sysRoleMenuService;

    /** AS-IS sys.Sys07_RoleMenu.updateRole (권한그룹복사) → 권한그룹을 넣은 회사 수 */
    @PostMapping("/copy-role")
    public ApiResponse<Integer> copyRole(@AuthenticationPrincipal UserPrincipal principal, @RequestBody RoleMenuCopyReq req) {
        return ApiResponse.ok(sysRoleMenuService.copyRole(principal, req));
    }

    /** AS-IS sys.Sys07_RoleMenu.updateMenu (매뉴권한복사) → 처리한 회사 수 */
    @PostMapping("/copy-menu")
    public ApiResponse<Integer> copyMenu(@AuthenticationPrincipal UserPrincipal principal, @RequestBody RoleMenuCopyReq req) {
        return ApiResponse.ok(sysRoleMenuService.copyMenu(principal, req));
    }
}
