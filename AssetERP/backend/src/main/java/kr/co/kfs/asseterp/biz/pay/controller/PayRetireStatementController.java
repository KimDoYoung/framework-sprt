package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireStatementCreateReq;
import kr.co.kfs.asseterp.biz.pay.service.PayRetireStatementService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 퇴직정산서 생성 창 (AS-IS Pay07_Lookup_RetireCreate) */
@RestController
@RequestMapping("/api/v1/pay/retire-statements")
@RequiredArgsConstructor
public class PayRetireStatementController {

    private final PayRetireStatementService service;

    /** AS-IS pay.Pay07_Retire.createRetire */
    @PostMapping
    public ApiResponse<Void> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayRetireStatementCreateReq req) {
        service.create(principal, req);
        return ApiResponse.ok(null);
    }
}
