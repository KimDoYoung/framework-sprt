package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.MenuGuideContentRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuGuideContentSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuGuideContentService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 화면안내 보기·작성 창 (AS-IS Sys55_Lookup_Content → server/sys/Sys55_MenuGuideCompany, EE103) */
@RestController
@RequestMapping("/api/v1/sys/menu-guide-contents")
@RequiredArgsConstructor
public class SysMenuGuideContentController {

    private final SysMenuGuideContentService service;

    /** AS-IS sys.Sys55_MenuGuideCompany.getMenuDetailModel — 없으면 data null */
    @GetMapping
    public ApiResponse<MenuGuideContentRes> getByMenuNo(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String menuNo) {
        return ApiResponse.ok(service.getByMenuNo(principal, menuNo));
    }

    /** AS-IS sys.Sys55_MenuGuideCompany.upsertContent */
    @PutMapping
    public ApiResponse<MenuGuideContentRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MenuGuideContentSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }
}
