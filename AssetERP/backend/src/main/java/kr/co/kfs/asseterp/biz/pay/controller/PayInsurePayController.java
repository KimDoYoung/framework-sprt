package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePayRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayInsurePaySaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayInsurePayService;
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

/** 4대보험 연말정산 납부 Pay32_Lookup_Detail (S16) — AS-IS pay.Pay32_InsurePay */
@RestController
@RequestMapping("/api/v1/pay/insure-pays")
@RequiredArgsConstructor
public class PayInsurePayController {

    private final PayInsurePayService service;

    /** pay.Pay32_InsurePay.selectByPersonId */
    @GetMapping
    public ApiResponse<List<PayInsurePayRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long personId,
                                                     @RequestParam(required = false) String insureCode,
                                                     @RequestParam(required = false) String year) {
        return ApiResponse.ok(service.search(principal, personId, insureCode, year));
    }

    /** pay.Pay32_InsurePay.selectByCompanyId (S27 4대보험 정산내역) */
    @GetMapping("/company")
    public ApiResponse<List<PayInsurePayRes>> searchByCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam(required = false) Long personId,
                                                              @RequestParam(required = false) String insureCode,
                                                              @RequestParam(required = false) String year) {
        return ApiResponse.ok(service.searchByCompany(principal, personId, insureCode, year));
    }

    /** pay.Pay32_InsurePay.update */
    @PutMapping
    public ApiResponse<List<PayInsurePayRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestBody List<PayInsurePaySaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** pay.Pay32_InsurePay.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
