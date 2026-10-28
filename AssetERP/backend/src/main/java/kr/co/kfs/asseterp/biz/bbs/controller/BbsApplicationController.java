package kr.co.kfs.asseterp.biz.bbs.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationRes;
import kr.co.kfs.asseterp.biz.bbs.service.BbsApplicationService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 요청서(신청서) — 증명서 신청내역 가져오기 (AS-IS Emp15_Tab_Cert·Emp15_Lookup_GetCert → server/bbs/Bbs11_Application) */
@RestController
@RequestMapping("/api/v1/bbs/applications")
@RequiredArgsConstructor
public class BbsApplicationController {

    private final BbsApplicationService service;

    /** AS-IS bbs.Bbs11_Application.selectByAppStatus — 증명서 신청(재직·경력·징계내역) 중 요청상태가 appStatus인 것(10 = 신청) */
    @GetMapping
    public ApiResponse<List<ApplicationRes>> searchByAppStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam(defaultValue = "10") String appStatus) {
        return ApiResponse.ok(service.searchByAppStatus(principal, appStatus));
    }
}
