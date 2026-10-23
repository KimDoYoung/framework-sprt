package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizProvideSetupRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizProvideSetupSaveReq;
import kr.co.kfs.asseterp.biz.biz.service.BizProvideSetupService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 직원 자동등록 설정 (AS-IS Biz04_Lookup_EmpSetup → server/biz/Biz04_ProvideSetup) */
@RestController
@RequestMapping("/api/v1/biz/provide-setups")
@RequiredArgsConstructor
public class BizProvideSetupController {

    private final BizProvideSetupService service;

    /** AS-IS biz.Biz04_ProvideSetup.selectByProvidePurCode */
    @GetMapping
    public ApiResponse<List<BizProvideSetupRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String providePurCode) {
        return ApiResponse.ok(service.search(principal, providePurCode));
    }

    /** AS-IS biz.Biz04_ProvideSetup.upsert → 저장한 건수 */
    @PutMapping
    public ApiResponse<Integer> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BizProvideSetupSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }
}
