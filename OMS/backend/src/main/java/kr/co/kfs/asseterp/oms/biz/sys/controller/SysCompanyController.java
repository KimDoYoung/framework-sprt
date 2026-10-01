package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyDetailRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuYnRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyNoteReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanySaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.LoginSecureRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.LoginSecureSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CompanyMenuYnSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.SysCompanyRes;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysCompanyService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 고객사 (AS-IS sys.Sys01_Company) — 전 고객사 데이터라 KFS 관리자(SYSADMIN)만 */
@RestController
@RequestMapping("/api/v1/sys/companies")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SYSADMIN')")
public class SysCompanyController {

    private final SysCompanyService sysCompanyService;

    @GetMapping
    public ApiResponse<List<SysCompanyRes>> searchCompanies(@RequestParam(required = false) String companyNm,
                                                            @RequestParam(required = false) String useYn) {
        return ApiResponse.ok(sysCompanyService.searchCompanies(companyNm, useYn));
    }

    /** 메뉴 일괄복사 대상 고객사 */
    @GetMapping("/copy-candidates")
    public ApiResponse<List<SysCompanyRes>> searchCopyCompanies(@RequestParam(required = false) String searchText) {
        return ApiResponse.ok(sysCompanyService.searchCopyCompanies(searchText));
    }

    /** 메뉴를 쓰는 고객사 (메뉴 관리 오른쪽) */
    @GetMapping("/by-menu")
    public ApiResponse<List<CompanyMenuYnRes>> searchCompaniesByMenu(@RequestParam Long menuId) {
        return ApiResponse.ok(sysCompanyService.searchCompaniesByMenu(menuId));
    }

    @PutMapping("/by-menu")
    public ApiResponse<List<CompanyMenuYnRes>> updateCompaniesByMenu(@RequestParam Long menuId,
                                                                     @RequestBody List<CompanyMenuYnSaveReq> rows) {
        return ApiResponse.ok(sysCompanyService.updateCompaniesByMenu(menuId, rows));
    }

    // ── 고객별 시스템정보 관리 (AS-IS Sys01_Tab_Company) ──

    @GetMapping("/details")
    public ApiResponse<List<CompanyDetailRes>> searchCompanyDetails(@RequestParam(required = false) String companyNm,
                                                                    @RequestParam(required = false) String useYn) {
        return ApiResponse.ok(sysCompanyService.searchCompanyDetails(companyNm, useYn));
    }

    @GetMapping("/{companyId}")
    public ApiResponse<CompanyDetailRes> getCompany(@PathVariable Long companyId) {
        return ApiResponse.ok(sysCompanyService.getCompany(companyId));
    }

    /** 신규 고객사 + 최상위 조직 + 기본 공통코드 */
    @PostMapping
    public ApiResponse<CompanyDetailRes> createCompany(@RequestBody CompanySaveReq req) {
        return ApiResponse.ok(sysCompanyService.createCompany(req));
    }

    @PutMapping("/{companyId}")
    public ApiResponse<CompanyDetailRes> updateCompany(@PathVariable Long companyId, @RequestBody CompanySaveReq req) {
        return ApiResponse.ok(sysCompanyService.updateCompany(companyId, req));
    }

    @PutMapping("/{companyId}/note")
    public ApiResponse<Void> updateNote(@PathVariable Long companyId, @RequestBody CompanyNoteReq req) {
        sysCompanyService.updateNote(companyId, req.note());
        return ApiResponse.ok(null);
    }

    @DeleteMapping
    public ApiResponse<Integer> deleteCompanies(@RequestBody List<Long> companyIds) {
        return ApiResponse.ok(sysCompanyService.deleteCompanies(companyIds));
    }

    // ── 공인IP (AS-IS Sys29_Lookup_PublicIpList) ──

    @GetMapping("/{companyId}/login-secures")
    public ApiResponse<List<LoginSecureRes>> searchLoginSecures(@PathVariable Long companyId) {
        return ApiResponse.ok(sysCompanyService.searchLoginSecures(companyId));
    }

    @PutMapping("/login-secures")
    public ApiResponse<List<LoginSecureRes>> updateLoginSecures(@RequestBody List<LoginSecureSaveReq> rows) {
        return ApiResponse.ok(sysCompanyService.updateLoginSecures(rows));
    }

    @DeleteMapping("/login-secures")
    public ApiResponse<Integer> deleteLoginSecures(@RequestBody List<Long> ids) {
        return ApiResponse.ok(sysCompanyService.deleteLoginSecures(ids));
    }
}
