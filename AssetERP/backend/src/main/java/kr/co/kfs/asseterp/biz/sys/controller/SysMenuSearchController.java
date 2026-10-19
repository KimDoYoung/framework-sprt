package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.MenuSearchRes;
import kr.co.kfs.asseterp.biz.sys.service.SysMenuSearchService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 화면 찾기 (AS-IS Sys06_Lookup_SearchMenu → server/sys/Sys06_Menu.selectByText·selectByTextManager) */
@RestController
@RequestMapping("/api/v1/sys/menu-search")
@RequiredArgsConstructor
public class SysMenuSearchController {

    private final SysMenuSearchService service;

    @GetMapping
    public ApiResponse<List<MenuSearchRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam(required = false) Long companyId,
                                                   @RequestParam(required = false) String searchText,
                                                   @RequestParam(defaultValue = "true") boolean menuNameYn) {
        return ApiResponse.ok(service.search(principal, companyId, searchText, menuNameYn));
    }
}
