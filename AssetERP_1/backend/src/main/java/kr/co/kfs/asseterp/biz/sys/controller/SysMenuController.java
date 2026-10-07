package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.MenuRes;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** B06: 프레임 메뉴 트리만 (OMS SysMenuController에서 가져옴). 메뉴 관리 API는 해당 A에서 추가한다 */
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
