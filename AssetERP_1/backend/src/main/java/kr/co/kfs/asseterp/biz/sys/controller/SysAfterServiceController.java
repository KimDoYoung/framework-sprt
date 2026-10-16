package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceAdminSaveReq;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceRemarksReq;
import kr.co.kfs.asseterp.biz.sys.dto.AfterServiceRes;
import kr.co.kfs.asseterp.biz.sys.service.SysAfterServiceService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 개선사항 및 오류 통보 (AS-IS Sys90_Tab_AfterServiceAdmin → server/sys/Sys90_AfterService) — 관리자 전용 */
@RestController
@RequestMapping("/api/v1/sys/after-services")
@RequiredArgsConstructor
public class SysAfterServiceController {

    private final SysAfterServiceService sysAfterServiceService;

    /** AS-IS sys.Sys90_AfterService.selectByAdmin / selectByIncomplete (incompleteOnly) — companyText는 회사명, '%' = 전체 */
    @GetMapping("/admin")
    public ApiResponse<List<AfterServiceRes>> searchAdmin(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate happenStartDate,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate happenEndDate,
                                                          @RequestParam(required = false) String companyText,
                                                          @RequestParam(required = false) String typeYn,
                                                          @RequestParam(required = false) String stateCd,
                                                          @RequestParam(defaultValue = "false") boolean unconfirmedOnly,
                                                          @RequestParam(defaultValue = "false") boolean incompleteOnly,
                                                          @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(sysAfterServiceService.searchAdmin(principal, happenStartDate, happenEndDate, companyText, typeYn, stateCd,
                unconfirmedOnly, incompleteOnly, searchText));
    }

    /** AS-IS sys.Sys90_AfterService.selectById */
    @GetMapping("/{afterServiceId}")
    public ApiResponse<AfterServiceRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long afterServiceId) {
        return ApiResponse.ok(sysAfterServiceService.getById(principal, afterServiceId));
    }

    /** AS-IS sys.Sys90_AfterService.adminUpdate → 저장된 행 */
    @PutMapping("/admin")
    public ApiResponse<AfterServiceRes> adminUpdate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AfterServiceAdminSaveReq req) {
        return ApiResponse.ok(sysAfterServiceService.adminUpdate(principal, req));
    }

    /** AS-IS sys.Sys90_AfterService.updateRemarks → 저장된 행 */
    @PutMapping("/{afterServiceId}/remarks")
    public ApiResponse<AfterServiceRes> updateRemarks(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long afterServiceId,
                                                      @RequestBody AfterServiceRemarksReq req) {
        return ApiResponse.ok(sysAfterServiceService.updateRemarks(principal, afterServiceId, req.remarks()));
    }
}
