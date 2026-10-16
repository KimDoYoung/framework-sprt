package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserMenuReq;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserMenuRes;
import kr.co.kfs.asseterp.biz.sys.service.SysAdminUserMenuService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 관리자별 메뉴 권한 (AS-IS Sys82_Lookup_UserMenu → Sys06_Menu.selectByAdminUserId / Sys82_AdminUserMenu.updateMenu) */
@RestController
@RequestMapping("/api/v1/sys/admin-users/{userId}/menus")
@RequiredArgsConstructor
public class SysAdminUserMenuController {

    private final SysAdminUserMenuService service;

    @GetMapping
    public ApiResponse<List<AdminUserMenuRes>> search(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long userId) {
        return ApiResponse.ok(service.searchMenus(principal, userId));
    }

    @PutMapping
    public ApiResponse<List<AdminUserMenuRes>> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long userId,
                                                      @RequestBody List<AdminUserMenuReq> rows) {
        return ApiResponse.ok(service.updateMenus(principal, userId, rows));
    }
}
