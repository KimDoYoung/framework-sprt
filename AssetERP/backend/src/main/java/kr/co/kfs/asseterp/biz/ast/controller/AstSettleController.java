package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.SettleAccruedRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleExpenseRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleHistoryRes;
import kr.co.kfs.asseterp.biz.ast.dto.SettleIdsReq;
import kr.co.kfs.asseterp.biz.ast.dto.SettleMultiReq;
import kr.co.kfs.asseterp.biz.ast.dto.SettleSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstSettleService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 미수/미지급 결제 Pay50_Tab_ExpenseSettle (U11) — AS-IS ast.Ast07_Settle · ast.Ast06_Tr.selectByAccrued */
@RestController
@RequestMapping("/api/v1/ast/settles")
@RequiredArgsConstructor
public class AstSettleController {

    private final AstSettleService service;

    /** ast.Ast06_Tr.selectByAccrued (고유자산·국내·지급) */
    @GetMapping("/accrueds")
    public ApiResponse<List<SettleAccruedRes>> accrueds(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(required = false) Long corpId,
                                                        @RequestParam(required = false) String searchText,
                                                        @RequestParam(required = false) String trCode) {
        return ApiResponse.ok(service.searchAccrueds(principal, corpId, searchText, trCode));
    }

    /** ast.Ast07_Settle.selectByHistoryPaging — selectType 1·3 최근 20건 / 2 조회조건(쪽 나누기) */
    @GetMapping("/histories")
    public ApiResponse<PageRes<SettleHistoryRes>> histories(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam(defaultValue = "1") String assetType,
                                                            @RequestParam(defaultValue = "1") String selectType,
                                                            @RequestParam(required = false) String payCode,
                                                            @RequestParam(required = false) String trCode,
                                                            @RequestParam(required = false) String corpId,
                                                            @RequestParam(required = false) String searchText,
                                                            @RequestParam(defaultValue = "100") long limit,
                                                            @RequestParam(defaultValue = "0") long offset) {
        return ApiResponse.ok(service.searchHistory(principal, assetType, selectType, payCode, trCode, corpId, searchText, limit, offset));
    }

    /** pay.Pay50_Expense.selectById 중 결제등록 창이 쓰는 값 */
    @GetMapping("/expense-info")
    public ApiResponse<SettleExpenseRes> expenseInfo(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long expenseId) {
        return ApiResponse.ok(service.getExpenseInfo(principal, expenseId));
    }

    /** ast.Ast07_Settle.update (새 결제) → 새 결제 ID */
    @PostMapping
    public ApiResponse<Long> create(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody SettleSaveReq req) {
        return ApiResponse.ok(service.createSettle(principal, req));
    }

    /** ast.Ast07_Settle.updateMulti */
    @PostMapping("/multi")
    public ApiResponse<Void> createMulti(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody SettleMultiReq req) {
        service.createSettles(principal, req);
        return ApiResponse.ok(null);
    }

    /** ast.Ast07_Settle.delete (취소) */
    @PostMapping("/delete")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody SettleIdsReq req) {
        service.deleteSettles(principal, req.settleIds());
        return ApiResponse.ok(null);
    }
}
