package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxAmountReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxDetailRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxItemSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxOfficeSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayRetireTaxService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** 퇴직정산 소득세 탭 Pay13_TabPage_RetireTax (S22) — AS-IS pay.Pay13_RetireTax · Pay14_RetireTaxItem */
@RestController
@RequestMapping("/api/v1/pay/retire-taxes")
@RequiredArgsConstructor
public class PayRetireTaxController {

    private final PayRetireTaxService service;

    /** Pay14_RetireTaxItem.selectByMonthId ×3 + Pay13_RetireTax.getOfficePayTax·selectByMonthId */
    @GetMapping("/{monthId}")
    public ApiResponse<PayRetireTaxDetailRes> detail(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long monthId) {
        return ApiResponse.ok(service.detail(principal, monthId));
    }

    /** Pay14_RetireTaxItem.insertRetireTaxItem */
    @PutMapping("/items")
    public ApiResponse<Void> saveItems(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayRetireTaxItemSaveReq req) {
        service.saveItems(principal, req);
        return ApiResponse.ok(null);
    }

    /** Pay13_RetireTax.insertRetireTax */
    @PutMapping("/amounts")
    public ApiResponse<Void> saveAmount(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayRetireTaxAmountReq req) {
        service.saveAmount(principal, req);
        return ApiResponse.ok(null);
    }

    /** Pay13_RetireTax.insertOfficePayTax */
    @PutMapping("/office")
    public ApiResponse<Void> saveOffice(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayRetireTaxOfficeSaveReq req) {
        service.saveOfficePayTax(principal, req);
        return ApiResponse.ok(null);
    }
}
