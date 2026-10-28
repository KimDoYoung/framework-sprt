package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.pay.dto.PayRetireLeaveCalcRes;
import kr.co.kfs.asseterp.biz.pay.dto.PayRetireLeaveRes;
import kr.co.kfs.asseterp.biz.pay.service.PayRetireLeaveService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/** 퇴직정산 연차수당 탭 Pay15_TabPage_RetireLeave · 잔여휴가 팝업 (S22) — AS-IS pay.Pay15_RetireLeave */
@RestController
@RequestMapping("/api/v1/pay/retire-leaves")
@RequiredArgsConstructor
public class PayRetireLeaveController {

    private final PayRetireLeaveService service;

    /** getRetireInfo → getRetireLeave → selectByMonthId ×2 — 퇴직정산서가 없으면 data null */
    @GetMapping
    public ApiResponse<PayRetireLeaveRes> retrieve(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long personId) {
        return ApiResponse.ok(service.retrieve(principal, personId));
    }

    /** calcRetireLeaveDays → selectRemLeaveDays → selectByMonthId(monthId=사원ID) ×2 */
    @PostMapping("/calc")
    public ApiResponse<PayRetireLeaveCalcRes> calc(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long personId,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate retireDate) {
        return ApiResponse.ok(service.calc(principal, personId, retireDate));
    }
}
