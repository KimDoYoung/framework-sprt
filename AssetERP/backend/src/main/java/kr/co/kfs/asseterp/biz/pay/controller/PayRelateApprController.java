package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayRelateApprRes;
import kr.co.kfs.asseterp.biz.pay.service.PayRelateApprService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/** 급여대장 상신 상태 Pay10_Tab_List (S18) — AS-IS pay.Pay05_RelateAppr */
@RestController
@RequestMapping("/api/v1/pay/relate-apprs")
@RequiredArgsConstructor
public class PayRelateApprController {

    private final PayRelateApprService service;

    /** pay.Pay05_RelateAppr.selectByCompanyId — 상신 이력이 없으면 data가 null */
    @GetMapping
    public ApiResponse<PayRelateApprRes> current(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String payCode,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payDate) {
        return ApiResponse.ok(service.current(principal, payCode, payDate));
    }
}
