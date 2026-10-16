package kr.co.kfs.asseterp.biz.company.controller;

import kr.co.kfs.asseterp.biz.company.dto.CompanyItemRes;
import kr.co.kfs.asseterp.biz.company.dto.TenantRes;
import kr.co.kfs.asseterp.biz.company.service.CompanyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.tenant.TenantFilter;
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
