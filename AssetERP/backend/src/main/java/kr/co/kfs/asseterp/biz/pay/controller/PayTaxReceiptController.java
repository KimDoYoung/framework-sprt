package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxReceiptRes;
import kr.co.kfs.asseterp.biz.pay.service.PayTaxReceiptService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 원천징수영수증(사본) Pay08_Tab_TaxWithholding (S24) — AS-IS pay.Pay08_TaxWithholding */
@RestController
@RequestMapping("/api/v1/pay/tax-receipts")
@RequiredArgsConstructor
public class PayTaxReceiptController {

    private final PayTaxReceiptService service;

    /** pay.Pay08_TaxWithholding.selectByPersonId — 로그인 사용자 본인의 영수증 파일 */
    @GetMapping("/mine")
    public ApiResponse<List<PayTaxReceiptRes>> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchMine(principal));
    }
}
