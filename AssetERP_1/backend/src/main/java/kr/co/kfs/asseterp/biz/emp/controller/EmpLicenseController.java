package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.LicenseRes;
import kr.co.kfs.asseterp.biz.emp.dto.LicenseSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpLicenseService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 자격사항 탭 (AS-IS Emp08_TabPage_License → server/emp/Emp08_License) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpLicenseController {

    private final EmpLicenseService empLicenseService;

    @GetMapping("/persons/{personId}/licenses")
    public ApiResponse<List<LicenseRes>> getLicenses(@AuthenticationPrincipal UserPrincipal principal,
                                                     @PathVariable Long personId) {
        return ApiResponse.ok(empLicenseService.getLicenses(principal, personId));
    }

    @PutMapping("/licenses")
    public ApiResponse<List<LicenseRes>> updateLicenses(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestBody List<LicenseSaveReq> rows) {
        return ApiResponse.ok(empLicenseService.updateLicenses(principal, rows));
    }

    @DeleteMapping("/licenses")
    public ApiResponse<Integer> deleteLicenses(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestBody List<Long> licenseIds) {
        return ApiResponse.ok(empLicenseService.deleteLicenses(principal, licenseIds));
    }
}
