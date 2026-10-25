package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CompanySetupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CompanySetupSaveReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCompanySetupService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 책무관리 시스템설정 (AS-IS server/tdm/Tdm91_CompanySetup) */
@RestController
@RequestMapping("/api/v1/tdm/company-setups")
@RequiredArgsConstructor
public class TdmCompanySetupController {

    private final TdmCompanySetupService service;

    /** AS-IS tdm.Tdm91_CompanySetup.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<CompanySetupRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS tdm.Tdm91_CompanySetup.update */
    @PutMapping
    public ApiResponse<List<CompanySetupRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<CompanySetupSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS tdm.Tdm91_CompanySetup.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> companySetupIds) {
        return ApiResponse.ok(service.delete(principal, companySetupIds));
    }
}
