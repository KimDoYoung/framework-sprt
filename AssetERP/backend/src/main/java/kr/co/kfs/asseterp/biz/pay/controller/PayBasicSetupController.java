package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayBasicSetupRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayBasicSetupSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayBasicSetupService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 급여공제 기본설정 pay30_Popup_BasicSetup (S28) — AS-IS pay.Pay30_BasicSetup */
@RestController
@RequestMapping("/api/v1/pay/basic-setup")
@RequiredArgsConstructor
public class PayBasicSetupController {

    private final PayBasicSetupService service;

    /** pay.Pay30_BasicSetup.selectByCompanyId — 설정이 없으면 data가 null */
    @GetMapping
    public ApiResponse<PayBasicSetupRes> get(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.get(principal));
    }

    /** pay.Pay30_BasicSetup.modelUpdate */
    @PutMapping
    public ApiResponse<PayBasicSetupRes> save(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestBody PayBasicSetupSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }
}
