package kr.co.kfs.asseterp.biz.apr.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprMgrRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprMgrSaveReq;
import kr.co.kfs.asseterp.biz.apr.service.AprAltApprMgrService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 대결자 지정(관리자) (AS-IS Apr07_Tab_AltApprMgr → server/apr/Apr07_AltAppr) */
@RestController
@RequestMapping("/api/v1/apr/alt-appr-mgrs")
@RequiredArgsConstructor
public class AprAltApprMgrController {

    private final AprAltApprMgrService service;

    /** AS-IS apr.Apr07_AltAppr.selectByText */
    @GetMapping
    public ApiResponse<List<AprAltApprMgrRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                      @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, startDate, endDate, searchText));
    }

    /** AS-IS apr.Apr07_AltAppr.notAltApprIdList + update */
    @PutMapping
    public ApiResponse<List<AprAltApprMgrRes>> save(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody List<AprAltApprMgrSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS apr.Apr07_AltAppr.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
