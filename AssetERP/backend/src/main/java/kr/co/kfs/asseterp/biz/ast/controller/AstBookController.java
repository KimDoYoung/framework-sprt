package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.BookFullRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookPeriodRes;
import kr.co.kfs.asseterp.biz.ast.dto.FinanceGroupRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookRes;
import kr.co.kfs.asseterp.biz.ast.dto.HoldBookRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookSumRes;
import kr.co.kfs.asseterp.biz.ast.dto.DepositCleanReq;
import kr.co.kfs.asseterp.biz.ast.service.AstBookService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 일일자금관리 Act02_Tab_DepositIoList (U01) — AS-IS ast.Ast09_Book */
@RestController
@RequestMapping("/api/v1/ast/books")
@RequiredArgsConstructor
public class AstBookController {

    private final AstBookService service;

    /** ast.Ast09_Book.selectByHoldDate (astType 1 예금) */
    @GetMapping("/deposits")
    public ApiResponse<List<BookRes>> deposits(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate) {
        return ApiResponse.ok(service.searchDeposits(principal, holdDate));
    }

    /** ast.Ast09_Book.selectByHoldDate (astType 2 금융자산) — W06 보유자산 조회창 */
    @GetMapping("/holds")
    public ApiResponse<List<HoldBookRes>> holds(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                                @RequestParam(defaultValue = "1") String abroType,
                                                @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchHolds(principal, holdDate, abroType, searchText));
    }

    /** ast.Ast09_Book.selectDepositCurGroupSum */
    @GetMapping("/deposits/cur-sums")
    public ApiResponse<List<BookSumRes>> depositCurSums(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate) {
        return ApiResponse.ok(service.searchDepositCurSums(principal, holdDate));
    }

    /** ast.Ast09_Book.selectByHoldDatePeriod (U02) — GET이지만 조회 전에 내 sys99_print 자료를 다시 만든다(AS-IS 그대로). depositId 없으면 전체 */
    @GetMapping("/deposits/period")
    public ApiResponse<List<BookPeriodRes>> depositsPeriod(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                           @RequestParam(required = false) Long depositId,
                                                           @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchDepositsPeriod(principal, startDate, closeDate,
                depositId == null ? "%" : String.valueOf(depositId), "%" + searchText + "%"));
    }

    /** ast.Ast09_Book.createDepositBook */
    @PostMapping("/deposits/clean")
    public ApiResponse<Void> clean(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody DepositCleanReq req) {
        service.createDepositBook(principal, req.stdDate());
        return ApiResponse.ok(null);
    }

    /** ast.Ast09_Book.selectByHoldDate (astType 2 금융자산) — 금융상품 보유내역 Ast09_Tab_FinanceBook (W12) · 외화 Ast09_Tab_FinanceForBook (W13, abroType 2) */
    @GetMapping("/finance")
    public ApiResponse<List<BookFullRes>> finance(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                                  @RequestParam(required = false) String abroType,
                                                  @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchFinanceBooks(principal, holdDate, abroType, searchText));
    }

    /** ast.Ast09_Book.getHoldDate — 종목유형별 합계(상신 전에 내용이 있는지 보고, 본문 표를 만든다) */
    @GetMapping("/finance/groups")
    public ApiResponse<List<FinanceGroupRes>> financeGroups(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate) {
        return ApiResponse.ok(service.searchFinanceGroups(principal, holdDate));
    }

    /** sys.Sys99_Print.insertRdFinanceBook → rdGroupId */
    @PostMapping("/finance/rd")
    public ApiResponse<Long> financeRd(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                       @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.insertRdFinanceBook(principal, holdDate, searchText));
    }
}
