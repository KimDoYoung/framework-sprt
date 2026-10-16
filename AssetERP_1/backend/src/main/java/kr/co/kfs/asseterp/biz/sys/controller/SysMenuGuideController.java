package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.MenuGuideRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuGuideSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.MenuNameRes;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuGuideService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 화면안내등록 (AS-IS Sys06_Tab_MenuGuide → server/sys/Sys06_Menu·Sys00_Common) */
@RestController
@RequestMapping("/api/v1/sys/menu-guides")
@RequiredArgsConstructor
public class SysMenuGuideController {

    private final SysMenuGuideService service;

    /** AS-IS sys.Sys00_Common.selectMenuName: 메뉴명 콤보(1차 메뉴) */
    @GetMapping("/menu-names")
    public ApiResponse<List<MenuNameRes>> searchMenuNames(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchMenuNames(principal));
    }

    /** AS-IS sys.Sys06_Menu.selectByMenuId (menuId 없음 = 전체) */
    @GetMapping
    public ApiResponse<List<MenuGuideRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(required = false) Long menuId,
                                                  @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, menuId, searchText));
    }

    /** AS-IS sys.Sys06_Menu.update → 저장한 행 수 */
    @PutMapping
    public ApiResponse<Integer> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<MenuGuideSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }
}
