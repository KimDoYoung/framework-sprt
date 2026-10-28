package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxWithholdingRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxWithholdingSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayTaxWithholdingService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 갑근세확인서 발급 Pay40_Tab_TaxWithholding (S23) — AS-IS pay.Pay40_IncomeTaxWithholding */
@RestController
@RequestMapping("/api/v1/pay/tax-withholdings")
@RequiredArgsConstructor
public class PayTaxWithholdingController {

    private final PayTaxWithholdingService service;

    /** pay.Pay40_IncomeTaxWithholding.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<PayTaxWithholdingRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam(required = false) String stdYear) {
        return ApiResponse.ok(service.search(principal, stdYear));
    }

    /** pay.Pay40_IncomeTaxWithholding.updateList */
    @PutMapping
    public ApiResponse<List<PayTaxWithholdingRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestBody List<PayTaxWithholdingSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** pay.Pay40_IncomeTaxWithholding.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
