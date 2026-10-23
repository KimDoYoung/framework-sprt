package kr.co.kfs.asseterp.biz.mkt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktTargetRes;
import kr.co.kfs.asseterp.biz.mkt.service.MktTargetCompanyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** 업무활동처(거래상대방) 조회창 (AS-IS Mkt01_Lookup_Select2 → server/mkt/Mkt01_TargetCompany) */
@RestController
@RequestMapping("/api/v1/mkt/target-companies")
@RequiredArgsConstructor
public class MktTargetCompanyController {

    private final MktTargetCompanyService service;

    /** AS-IS mkt.Mkt01_TargetCompany.selectTargetCompanyPaging — 회사별(cmp) */
    @GetMapping
    public ApiResponse<PageRes<MktTargetRes>> searchCompanies(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(defaultValue = "") String searchText,
                                                              @RequestParam(defaultValue = "0") long offset,
                                                              @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.searchCompanies(principal, searchText, offset, limit));
    }

    /** AS-IS mkt.Mkt01_TargetCompany.selectManagerPaging — 직원별(emp) */
    @GetMapping("/managers")
    public ApiResponse<PageRes<MktTargetRes>> searchManagers(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam(defaultValue = "") String searchText,
                                                             @RequestParam(defaultValue = "0") long offset,
                                                             @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.searchManagers(principal, searchText, offset, limit));
    }
}
