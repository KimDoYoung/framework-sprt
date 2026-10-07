package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyMenuTreeRes;
import kr.co.kfs.asseterp.biz.sys.dto.MenuRes;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuService;
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

    /** A10 회사별 메뉴맵핑 트리 (AS-IS sys.Sys06_Menu.selectByCompanyIdAll) */
    @GetMapping("/menus/companies/{companyId}")
    public ApiResponse<List<CompanyMenuTreeRes>> getCompanyMenuTree(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @PathVariable Long companyId) {
        return ApiResponse.ok(sysMenuService.getCompanyMenuTree(principal, companyId));
    }

    /** A10 회사별 메뉴맵핑 저장 (AS-IS sys.Sys06_Menu.updateCompanyMenu) → 저장된 행 */
    @PutMapping("/menus/companies/{companyId}")
    public ApiResponse<List<CompanyMenuTreeRes>> updateCompanyMenus(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @PathVariable Long companyId,
                                                                    @RequestBody List<CompanyMenuSaveReq> rows) {
        return ApiResponse.ok(sysMenuService.updateCompanyMenus(principal, companyId, rows));
    }
}
