package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductLimitRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxDeductLimitSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.service.PayTaxDeductService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 근로소득 세액공제 (AS-IS Pay27_TabPage_TaxDeductTable·Pay27_TabPage_TaxDeduct·Pay27_Popup_TaxDeductTableCreate → server/pay/Pay27_TaxDeductTable·Pay28_TaxDeductLimit) — 메뉴 #1279 */
@RestController
@RequestMapping("/api/v1/pay/tax-deducts")
@RequiredArgsConstructor
public class PayTaxDeductController {

    private final PayTaxDeductService service;

    /** AS-IS Pay27_TaxDeductTable.selectByAll */
    @GetMapping("/dates")
    public ApiResponse<List<PayStartDateRes>> searchDates() {
        return ApiResponse.ok(service.searchDates());
    }

    /** AS-IS Pay27_TaxDeductTable.insert (적용일 생성) */
    @PostMapping("/dates")
    public ApiResponse<Void> createDate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayStartDateReq req) {
        service.createDate(principal, req.startDate());
        return ApiResponse.ok(null);
    }

    /** AS-IS Pay27_TaxDeductTable.deleteByDate → 지운 건수 */
    @DeleteMapping("/dates")
    public ApiResponse<Integer> deleteDate(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.deleteDate(principal, startDate));
    }

    /** AS-IS Pay27_TaxDeductTable.selectByDate */
    @GetMapping
    public ApiResponse<List<PayTaxDeductRes>> search(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.search(startDate));
    }

    /** AS-IS Pay27_TaxDeductTable.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<PayTaxDeductRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PayTaxDeductSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS Pay27_TaxDeductTable.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS Pay28_TaxDeductLimit.selectByDate */
    @GetMapping("/limits")
    public ApiResponse<List<PayTaxDeductLimitRes>> searchLimits(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.searchLimits(startDate));
    }

    /** AS-IS Pay28_TaxDeductLimit.update → 저장된 행(요청 순서) */
    @PutMapping("/limits")
    public ApiResponse<List<PayTaxDeductLimitRes>> saveLimits(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestBody List<PayTaxDeductLimitSaveReq> rows) {
        return ApiResponse.ok(service.saveLimits(principal, rows));
    }

    /** AS-IS Pay28_TaxDeductLimit.delete → 지운 건수 */
    @DeleteMapping("/limits")
    public ApiResponse<Integer> deleteLimits(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.deleteLimits(principal, ids));
    }
}
