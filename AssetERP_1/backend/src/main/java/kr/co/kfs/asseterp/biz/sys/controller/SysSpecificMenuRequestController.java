package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuRequestRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuRequestSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysSpecificMenuRequestService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 특정화면 사용요청 (AS-IS Sys53_Tab_SpecificMenuRequest → server/sys/Sys53_SpecificMenuRequest) */
@RestController
@RequestMapping("/api/v1/sys/specific-menu-requests")
@RequiredArgsConstructor
public class SysSpecificMenuRequestController {

    private final SysSpecificMenuRequestService sysSpecificMenuRequestService;

    /** AS-IS sys.Sys53_SpecificMenuRequest.selectByText (stateCd·specificWorkCd '%' = 전체) */
    @GetMapping
    public ApiResponse<List<SpecificMenuRequestRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam(required = false) String stateCd,
                                                            @RequestParam(required = false) String specificWorkCd) {
        return ApiResponse.ok(sysSpecificMenuRequestService.search(principal, stateCd, specificWorkCd));
    }

    /** AS-IS insertRow()의 새 행 기본값 (신청자·신청일) */
    @GetMapping("/new-row")
    public ApiResponse<SpecificMenuRequestRes> newRow(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(sysSpecificMenuRequestService.newRow(principal));
    }

    /** AS-IS sys.Sys53_SpecificMenuRequest.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<SpecificMenuRequestRes>> update(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestBody List<SpecificMenuRequestSaveReq> rows) {
        return ApiResponse.ok(sysSpecificMenuRequestService.update(principal, rows));
    }

    /** AS-IS sys.Sys53_SpecificMenuRequest.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(sysSpecificMenuRequestService.delete(principal, ids));
    }
}
