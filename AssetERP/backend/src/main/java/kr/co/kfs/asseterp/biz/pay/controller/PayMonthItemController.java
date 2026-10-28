package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayMonthItemSaveReq;
import kr.co.kfs.asseterp.biz.pay.service.PayMonthItemService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    /** pay.Pay11_MonthItem.recalculationTax — [소득세 재계산] */
    @PostMapping("/recalculate-tax")
    public ApiResponse<Void> recalculateTax(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long monthId) {
        service.recalculateTax(principal, monthId);
        return ApiResponse.ok(null);
    }
}
