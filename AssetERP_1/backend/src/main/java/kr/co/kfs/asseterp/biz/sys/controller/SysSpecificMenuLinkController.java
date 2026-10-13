package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuLinkRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuLinkSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysSpecificMenuLinkService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 특정매뉴 문서권한(Link) (AS-IS Sys52_Lookup_SpecificMenuLink → server/sys/Sys52_SpecificMenuLink) */
@RestController
@RequestMapping("/api/v1/sys/companies/{companyId}/specific-menu-links")
@RequiredArgsConstructor
public class SysSpecificMenuLinkController {

    private final SysSpecificMenuLinkService sysSpecificMenuLinkService;

    /** AS-IS sys.Sys52_SpecificMenuLink.selectBySpecificWorkCode */
    @GetMapping
    public ApiResponse<List<SpecificMenuLinkRes>> search(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                                         @RequestParam String specificWorkCd) {
        return ApiResponse.ok(sysSpecificMenuLinkService.search(principal, companyId, specificWorkCd));
    }

    /** AS-IS sys.Sys52_SpecificMenuLink.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<SpecificMenuLinkRes>> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                                         @RequestBody List<SpecificMenuLinkSaveReq> rows) {
        return ApiResponse.ok(sysSpecificMenuLinkService.update(principal, companyId, rows));
    }

    /** AS-IS sys.Sys52_SpecificMenuLink.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                       @RequestBody List<Long> ids) {
        return ApiResponse.ok(sysSpecificMenuLinkService.delete(principal, companyId, ids));
    }
}
