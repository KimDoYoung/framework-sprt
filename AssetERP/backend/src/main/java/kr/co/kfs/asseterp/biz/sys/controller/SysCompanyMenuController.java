package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuCopyReq;
import kr.co.kfs.asseterp.biz.sys.service.SysCompanyMenuService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 회사별 메뉴 (AS-IS server/sys/Sys03_CompanyMenu) */
@RestController
@RequestMapping("/api/v1/sys/company-menus")
@RequiredArgsConstructor
public class SysCompanyMenuController {

    private final SysCompanyMenuService sysCompanyMenuService;

    /** AS-IS sys.Sys03_CompanyMenu.insert (매뉴권한복사(초기)) */
    @PostMapping("/copy")
    public ApiResponse<Void> copyMenus(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CompanyMenuCopyReq req) {
        sysCompanyMenuService.copyMenus(principal, req);
        return ApiResponse.ok(null);
    }
}
