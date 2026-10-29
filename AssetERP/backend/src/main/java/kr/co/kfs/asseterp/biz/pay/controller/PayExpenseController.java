package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseContentReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRejectReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRequestRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseUpdateReq;
import kr.co.kfs.asseterp.biz.pay.service.PayExpenseService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 지출결의서(경영관리) Pay50_Tab_ExpenseManager (U03) — AS-IS pay.Pay50_Expense */
@RestController
@RequestMapping("/api/v1/pay/expenses")
@RequiredArgsConstructor
public class PayExpenseController {

    private final PayExpenseService service;

    /** pay.Pay50_Expense.selectExpenseAppr (limit은 불러오기 창의 "최대 50건") */
    @GetMapping
    public ApiResponse<List<ExpenseRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                @RequestParam(defaultValue = "false") boolean statusCheckYn,
                                                @RequestParam(required = false) String expenseCode,
                                                @RequestParam(required = false) String payMethodCode,
                                                @RequestParam(required = false) String searchText,
                                                @RequestParam(defaultValue = "true") boolean managerYn,
                                                @RequestParam(required = false) Integer limit) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, statusCheckYn, expenseCode, payMethodCode, searchText, managerYn, limit));
    }

    /** pay.Pay50_Expense.selectExpenseRequest */
    @GetMapping("/requests")
    public ApiResponse<List<ExpenseRequestRes>> requests(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.requests(principal, searchText));
    }

    /** pay.Pay50_Expense.selectById */
    @GetMapping("/{expenseId}")
    public ApiResponse<ExpenseRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long expenseId) {
        return ApiResponse.ok(service.get(principal, expenseId));
    }

    /** pay.Pay50_Expense.update */
    @PutMapping("/{expenseId}")
    public ApiResponse<ExpenseRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long expenseId,
                                          @RequestBody ExpenseUpdateReq req) {
        return ApiResponse.ok(service.update(principal, expenseId, req));
    }

    /** pay.Pay50_Expense.initExpense — [삭제] */
    @PostMapping("/init")
    public ApiResponse<Integer> init(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.init(principal, ids));
    }

    /** pay.Pay50_Expense.updateRejectReason — [반려]·[반려취소](사유 null) */
    @PutMapping("/reject")
    public ApiResponse<Integer> reject(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ExpenseRejectReq req) {
        return ApiResponse.ok(service.reject(principal, req.ids(), req.rejectReason()));
    }

    /** pay.Pay50_Expense.updateApprEmpId — [지출요청내역 가져오기] */
    @PutMapping("/take-requests")
    public ApiResponse<Integer> takeRequests(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ExpenseRequestRes> rows) {
        return ApiResponse.ok(service.takeRequests(principal, rows));
    }

    /** pay.Pay50_Expense.updateContent */
    @PutMapping("/{expenseId}/content")
    public ApiResponse<Void> updateContent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long expenseId,
                                           @RequestBody ExpenseContentReq req) {
        service.updateContent(principal, expenseId, req.content());
        return ApiResponse.ok(null);
    }
}
