package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysSpecificMenuService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 특정매뉴 권한 (AS-IS Sys50_TabPage_SpecificMenu → server/sys/Sys50_SpecificMenu) */
@RestController
@RequestMapping("/api/v1/sys/companies/{companyId}/specific-menus")
@RequiredArgsConstructor
public class SysSpecificMenuController {

    private final SysSpecificMenuService sysSpecificMenuService;

    /** AS-IS sys.Sys50_SpecificMenu.selectBySpecificWorkCode */
    @GetMapping
    public ApiResponse<List<SpecificMenuRes>> search(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                                     @RequestParam(required = false) String specificWorkCd) {
        return ApiResponse.ok(sysSpecificMenuService.search(principal, companyId, specificWorkCd));
    }

    /** AS-IS sys.Sys50_SpecificMenu.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<SpecificMenuRes>> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                                     @RequestBody List<SpecificMenuSaveReq> rows) {
        return ApiResponse.ok(sysSpecificMenuService.update(principal, companyId, rows));
    }

    /** AS-IS sys.Sys50_SpecificMenu.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                       @RequestBody List<Long> specificMenuIds) {
        return ApiResponse.ok(sysSpecificMenuService.delete(principal, companyId, specificMenuIds));
    }
}
