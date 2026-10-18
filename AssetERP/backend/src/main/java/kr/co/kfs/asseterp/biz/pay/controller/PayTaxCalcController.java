package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxCalcRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayTaxCalcSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayStartDateRes;
import kr.co.kfs.asseterp.biz.pay.service.PayTaxCalcService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 과세표준 구간별 기본세율 (AS-IS Pay26_TabPage_TaxCalcTable·Pay26_TabPage_TaxCalc·Pay26_Popup_TaxCalcCreate → server/pay/Pay26_TaxCalcTable) — 메뉴 #1279 */
@RestController
@RequestMapping("/api/v1/pay/tax-calcs")
@RequiredArgsConstructor
public class PayTaxCalcController {

    private final PayTaxCalcService service;

    /** AS-IS Pay26_TaxCalcTable.selectByAll */
    @GetMapping("/dates")
    public ApiResponse<List<PayStartDateRes>> searchDates() {
        return ApiResponse.ok(service.searchDates());
    }

    /** AS-IS Pay26_TaxCalcTable.insert (적용일 생성) */
    @PostMapping("/dates")
    public ApiResponse<Void> createDate(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayStartDateReq req) {
        service.createDate(principal, req.startDate());
        return ApiResponse.ok(null);
    }

    /** AS-IS Pay26_TaxCalcTable.deleteByDate → 지운 건수 */
    @DeleteMapping("/dates")
    public ApiResponse<Integer> deleteDate(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.deleteDate(principal, startDate));
    }

    /** AS-IS Pay26_TaxCalcTable.selectByDate */
    @GetMapping
    public ApiResponse<List<PayTaxCalcRes>> search(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ApiResponse.ok(service.search(startDate));
    }

    /** AS-IS Pay26_TaxCalcTable.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<PayTaxCalcRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PayTaxCalcSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS Pay26_TaxCalcTable.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
