package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseContentReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseFormRes;
import kr.co.kfs.asseterp.biz.pay.service.PayExpenseFormService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 지출요청 상세양식 Pay51_Lookup_ExpenseForm (U03 양식관리) — AS-IS pay.Pay51_ExpenseForm */
@RestController
@RequestMapping("/api/v1/pay/expense-forms")
@RequiredArgsConstructor
public class PayExpenseFormController {

    private final PayExpenseFormService service;

    /** pay.Pay51_ExpenseForm.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<ExpenseFormRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** pay.Pay51_ExpenseForm.formCheck — 새 코드의 빈 양식을 만든 건수 */
    @PostMapping("/check")
    public ApiResponse<Integer> check(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.check(principal));
    }

    /** pay.Pay51_ExpenseForm.modelUpdate */
    @PutMapping("/{expenseFormId}/content")
    public ApiResponse<Void> updateContent(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long expenseFormId,
                                           @RequestBody ExpenseContentReq req) {
        service.updateContent(principal, expenseFormId, req.content());
        return ApiResponse.ok(null);
    }
}
