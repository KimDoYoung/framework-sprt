package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprOutstandingRes;
import kr.co.kfs.asseterp.biz.apr.service.AprOutstandingService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 미결재건 창 (AS-IS Frm01_Lookup_Outstanding, EE56) */
@RestController
@RequestMapping("/api/v1/apr/outstandings")
@RequiredArgsConstructor
public class AprOutstandingController {

    private final AprOutstandingService service;

    /** AS-IS apr.Apr01_Appr.selectOutstandingPopup */
    @GetMapping
    public ApiResponse<List<AprOutstandingRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchOutstanding(principal));
    }
}
