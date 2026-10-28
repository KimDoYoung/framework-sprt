package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemAmountReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemBulkReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemSaveReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemTextRes;
import kr.co.kfs.asseterp.biz.pay.service.PayMonthItemService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 급여 항목 Pay11_TabPage_MonthItem (S16) — AS-IS pay.Pay11_MonthItem */
@RestController
@RequestMapping("/api/v1/pay/month-items")
@RequiredArgsConstructor
public class PayMonthItemController {

    private final PayMonthItemService service;

    /** pay.Pay11_MonthItem.selectByItemType */
    @GetMapping
    public ApiResponse<List<PayMonthItemRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam Long monthId, @RequestParam String itemType) {
        return ApiResponse.ok(service.search(principal, monthId, itemType));
    }

    /** pay.Pay11_MonthItem.updateList(지급) / getInsureAdjustModi(공제) */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayMonthItemSaveReq req) {
        service.save(principal, req);
        return ApiResponse.ok(null);
    }

    /** pay.Pay11_MonthItem.selectByText (S17 급여관리(항목별)) */
    @GetMapping("/by-text")
    public ApiResponse<List<PayMonthItemTextRes>> searchByText(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam String payCode,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payDate,
                                                               @RequestParam(defaultValue = "%") String itemCode,
                                                               @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByText(principal, payCode, payDate, itemCode, searchText));
    }

    /** pay.Pay11_MonthItem.updateMonthItemList (S17 [저장]) */
    @PutMapping("/amounts")
    public ApiResponse<Void> saveAmounts(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<PayMonthItemAmountReq> rows) {
        service.saveAmounts(principal, rows);
        return ApiResponse.ok(null);
    }

    /** pay.Pay11_MonthItem.insertItemType (S17 [일괄생성]) → 추가한 건수 */
    @PostMapping("/bulk")
    public ApiResponse<Integer> insertBulk(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayMonthItemBulkReq req) {
        return ApiResponse.ok(service.insertBulk(principal, req));
    }

    /** sys.Sys99_Print.insertRdMonthItem (S17 [출력/다운로드]) → 출력 자료 groupId */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam String payCode,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payDate,
                                       @RequestParam(defaultValue = "%") String itemCode,
                                       @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.insertRdPrint(principal, payCode, payDate, itemCode, searchText));
    }

    /** pay.Pay11_MonthItem.recalculationTax — [소득세 재계산] */
    @PostMapping("/recalculate-tax")
    public ApiResponse<Void> recalculateTax(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long monthId) {
        service.recalculateTax(principal, monthId);
        return ApiResponse.ok(null);
    }
}
