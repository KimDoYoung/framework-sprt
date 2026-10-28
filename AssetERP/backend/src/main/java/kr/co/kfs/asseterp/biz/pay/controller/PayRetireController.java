package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.pay.dto.PayRetireCreateReq;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireMonthRes;
import kr.co.kfs.asseterp.biz.pay.service.PayRetireService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** 퇴직정산 Pay10_Tab_Retire (S22) — AS-IS pay.Pay10_Month(퇴직) · Pay12_RetireInsure.getInsureRetire */
@RestController
@RequestMapping("/api/v1/pay/retires")
@RequiredArgsConstructor
public class PayRetireController {

    private final PayRetireService service;

    /** pay.Pay10_Month.selectByPersonId(payCode 03) — 없으면 data null */
    @GetMapping("/month")
    public ApiResponse<PayRetireMonthRes> month(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long personId) {
        return ApiResponse.ok(service.month(principal, personId));
    }

    /** pay.Pay10_Month.selectByRetirePayCode — RD 폼 행 수 */
    @GetMapping("/rd-count")
    public ApiResponse<Long> rdCount(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long personId) {
        return ApiResponse.ok(service.rdRowCount(principal, personId));
    }

    /** [생성] — getInsureRetire(insert) */
    @PostMapping
    public ApiResponse<Void> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody PayRetireCreateReq req) {
        service.create(principal, req);
        return ApiResponse.ok(null);
    }

    /** [삭제] — getInsureRetire(C). 퇴직정산서가 없으면 false */
    @DeleteMapping
    public ApiResponse<Boolean> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long personId) {
        return ApiResponse.ok(service.delete(principal, personId));
    }
}
