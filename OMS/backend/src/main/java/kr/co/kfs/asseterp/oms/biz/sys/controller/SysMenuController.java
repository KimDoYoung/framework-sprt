package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.MenuRes;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysMenuService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
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
}
