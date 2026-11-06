package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprMonitorOutstandingRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMonitorRequestRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprMonitorTemporaryRes;
import kr.co.kfs.asseterp.biz.apr.service.AprMonitorService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** MyPage 전자결재 박스 (AS-IS frm/Monitoring_Page_Appr — 미결함·결재요청함·임시저장함) */
@RestController
@RequestMapping("/api/v1/apr/monitors")
@RequiredArgsConstructor
public class AprMonitorController {

    private final AprMonitorService service;

    /** AS-IS apr.Apr01_Appr.selectOutstanding */
    @GetMapping("/outstandings")
    public ApiResponse<List<AprMonitorOutstandingRes>> searchOutstanding(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchOutstanding(principal));
    }

    /** AS-IS apr.Apr01_Appr.selectMonitorngAppr */
    @GetMapping("/requests")
    public ApiResponse<List<AprMonitorRequestRes>> searchRequest(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchRequest(principal));
    }

    /** AS-IS apr.Apr01_Appr.selectTemporary */
    @GetMapping("/temporaries")
    public ApiResponse<List<AprMonitorTemporaryRes>> searchTemporary(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchTemporary(principal));
    }
}
