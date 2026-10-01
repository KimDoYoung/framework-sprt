package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.sys.dto.RoleCopyReq;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysRoleMenuService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 권한그룹별 메뉴권한 복사 (AS-IS Sys07_Tab_Company → sys.Sys07_RoleMenu). 여러 고객사에 쓰므로 KFS 관리자(SYSADMIN)만 */
@RestController
@RequestMapping("/api/v1/sys/role-menus")
@RequiredArgsConstructor
public class SysRoleMenuController {

    private final SysRoleMenuService sysRoleMenuService;

    /** 권한그룹 복사 → 복사한 회사 수 */
    @PostMapping("/copy-role")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<Integer> copyRole(@RequestBody RoleCopyReq req) {
        return ApiResponse.ok(sysRoleMenuService.copyRole(req));
    }

    /** 메뉴권한 복사 (메뉴 + 상위 메뉴) → 처리한 회사 수 */
    @PostMapping("/copy-menu")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<Integer> copyRoleMenu(@RequestBody RoleCopyReq req) {
        return ApiResponse.ok(sysRoleMenuService.copyRoleMenu(req));
    }
}
