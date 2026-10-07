package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyCreateReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyRes;
import kr.co.kfs.asseterp.biz.sys.service.SysCompanyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 고객별 시스템정보 관리 (AS-IS Sys01_Tab_Company → server/sys/Sys01_Company) */
@RestController
@RequestMapping("/api/v1/sys/companies")
@RequiredArgsConstructor
public class SysCompanyController {

    private final SysCompanyService sysCompanyService;

    /** AS-IS sys.Sys01_Company.selectByName */
    @GetMapping
    public ApiResponse<List<CompanyRes>> searchCompanies(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(required = false) String companyNm,
                                                         @RequestParam(required = false) String useYn) {
        return ApiResponse.ok(sysCompanyService.searchCompanies(principal, companyNm, useYn));
    }

    /** AS-IS sys.Sys01_Company.update (신규고객사 등록 팝업) → 등록된 회사 */
    @PostMapping
    public ApiResponse<CompanyRes> createCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestBody CompanyCreateReq req) {
        return ApiResponse.ok(sysCompanyService.createCompany(principal, req));
    }
}
