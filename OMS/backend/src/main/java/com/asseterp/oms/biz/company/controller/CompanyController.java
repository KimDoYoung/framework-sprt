package com.asseterp.oms.biz.company.controller;

import com.asseterp.oms.biz.company.dto.CompanyItemRes;
import com.asseterp.oms.biz.company.dto.TenantRes;
import com.asseterp.oms.biz.company.service.CompanyService;
import com.asseterp.oms.common.dto.ApiResponse;
import com.asseterp.oms.common.tenant.TenantFilter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 로그인 전 공개 API: 접속 회사(서브도메인) 정보, admin 로그인 화면의 회사 목록
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping("/tenant")
    public ApiResponse<TenantRes> getTenant(HttpServletRequest request) {
        return ApiResponse.ok(companyService.getTenant(TenantFilter.current(request)));
    }

    @GetMapping("/companies")
    public ApiResponse<List<CompanyItemRes>> searchCompanies(HttpServletRequest request) {
        return ApiResponse.ok(companyService.searchCompanies(TenantFilter.current(request)));
    }
}
