package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.CertRes;
import kr.co.kfs.asseterp.biz.emp.dto.CertSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpCertService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 증명서 발급 (AS-IS Emp15_Tab_Cert → server/emp/Emp15_Cert) */
@RestController
@RequestMapping("/api/v1/emp/certs")
@RequiredArgsConstructor
public class EmpCertController {

    private final EmpCertService service;

    /** AS-IS emp.Emp15_Cert.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<CertRes>> searchCerts(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.searchCerts(principal, startDate, closeDate));
    }

    /** AS-IS emp.Emp15_Cert.modelUpdate (INSERT) → 새 증명서 ID */
    @PostMapping
    public ApiResponse<Long> createCert(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CertSaveReq req) {
        return ApiResponse.ok(service.createCert(principal, req));
    }

    /** AS-IS emp.Emp15_Cert.delete */
    @DeleteMapping("/{certId}")
    public ApiResponse<Integer> deleteCert(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long certId) {
        return ApiResponse.ok(service.deleteCert(principal, certId));
    }
}
