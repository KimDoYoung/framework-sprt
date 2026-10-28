package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayPersonDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireTaxDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxCalcRes;
import kr.co.kfs.asseterp.biz.pay.service.PayRetireTableService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 소득세 탭 [보기] 창 4개 (S22) — 급여(monthId)의 지급일자 기준 표 */
@RestController
@RequestMapping("/api/v1/pay/retire-tables")
@RequiredArgsConstructor
public class PayRetireTableController {

    private final PayRetireTableService service;

    /** Pay24_Lookup_DeductTable — pay.Pay24_DeductTable.selectByMonthId(dataCode 1·2) */
    @GetMapping("/deduct")
    public ApiResponse<PayRetireDeductRes> deduct(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long monthId) {
        return ApiResponse.ok(service.deduct(principal, monthId));
    }

    /** Pay25_Lookup_PersonDeduct — pay.Pay25_PersonDeduct.selectByMonthId */
    @GetMapping("/person-deduct")
    public ApiResponse<List<PayPersonDeductRes>> personDeduct(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long monthId) {
        return ApiResponse.ok(service.personDeduct(principal, monthId));
    }

    /** Pay26_Lookup_TaxCalcTable — pay.Pay26_TaxCalcTable.selectByMonthId */
    @GetMapping("/tax-calc")
    public ApiResponse<List<PayTaxCalcRes>> taxCalc(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long monthId) {
        return ApiResponse.ok(service.taxCalc(principal, monthId));
    }

    /** Pay27_Lookup_TaxDeductTable — pay.Pay27_TaxDeductTable·Pay28_TaxDeductLimit.selectByMonthId */
    @GetMapping("/tax-deduct")
    public ApiResponse<PayRetireTaxDeductRes> taxDeduct(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long monthId) {
        return ApiResponse.ok(service.taxDeduct(principal, monthId));
    }
}
