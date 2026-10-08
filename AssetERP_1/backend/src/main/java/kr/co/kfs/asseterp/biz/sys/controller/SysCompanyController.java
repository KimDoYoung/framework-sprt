package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyCreateReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyManageReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyManageRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyNoteReq;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyOptionRes;
import kr.co.kfs.asseterp.biz.sys.dto.CompanyRes;
import kr.co.kfs.asseterp.biz.sys.service.SysCompanyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    /** AS-IS sys.Sys01_Company.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> deleteCompanies(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestBody List<Long> companyIds) {
        return ApiResponse.ok(sysCompanyService.deleteCompanies(principal, companyIds));
    }

    /** AS-IS sys.Sys00_Common.selectCompanyInfo (회사 콤보) */
    @GetMapping("/options")
    public ApiResponse<List<CompanyOptionRes>> searchCompanyOptions(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(sysCompanyService.searchCompanyOptions(principal));
    }

    /** AS-IS sys.Sys01_Company.selectById (로그인 회사의 문서번호 채번방식만 — 조직 팝업 C02) */
    @GetMapping("/current/dcr-numbering-code")
    public ApiResponse<String> getDcrNumberingCode(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(sysCompanyService.getDcrNumberingCode(principal));
    }

    /** 관리정보 탭 (AS-IS Sys01_TabPage_Info01 → sys.Sys01_Company.selectById) */
    @GetMapping("/{companyId}/manage")
    public ApiResponse<CompanyManageRes> getCompanyManage(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId) {
        return ApiResponse.ok(sysCompanyService.getCompanyManage(principal, companyId));
    }

    /** 관리정보 탭 저장 (AS-IS sys.Sys01_Company.update) → 저장된 행 */
    @PutMapping("/{companyId}/manage")
    public ApiResponse<CompanyManageRes> updateCompanyManage(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                                             @RequestBody CompanyManageReq req) {
        CompanyManageReq body = new CompanyManageReq(companyId, req.loginSecureYn(), req.companyNm(), req.locNm(), req.mailInfo(),
                req.emgrcyPasswd(), req.erpProductCd(), req.contType(), req.noticeDate(), req.closeDate(), req.icamCompanyCd(),
                req.icamAdvisCompanyCd(), req.assetYn(), req.advisYn(), req.pbsYn(), req.useYn());
        return ApiResponse.ok(sysCompanyService.updateCompanyManage(principal, body));
    }

    /** 비고 팝업 (AS-IS sys.Sys01_Company.updateNote) */
    @PutMapping("/{companyId}/note")
    public ApiResponse<Void> updateNote(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                        @RequestBody CompanyNoteReq req) {
        sysCompanyService.updateNote(principal, companyId, req.note());
        return ApiResponse.ok(null);
    }
}
