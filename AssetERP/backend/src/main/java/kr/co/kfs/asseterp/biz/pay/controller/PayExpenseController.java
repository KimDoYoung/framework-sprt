package kr.co.kfs.asseterp.biz.pay.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseAccountCodeReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseContentReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseDepositReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseJournalCreateReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseAccountSumRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseJournalRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseNewRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRejectReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRequestRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleApprRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleApprRowRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettlePrintReq;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleRes;
import kr.co.kfs.asseterp.biz.pay.dto.ExpenseSettleSaveReq;
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

    // ── U07 자금집행결의서 작성(Pay50_Tab_ExpensePayWrite) · U08 조회(Pay50_Tab_ExpensePay) ──

    /** pay.Pay50_Expense.selectExpensePay */
    @GetMapping("/settles")
    public ApiResponse<List<ExpenseSettleRes>> searchSettles(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                             @RequestParam(required = false) String expenseCode,
                                                             @RequestParam(required = false) String payYnCode,
                                                             @RequestParam(defaultValue = "false") boolean statusCheckYn,
                                                             @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchSettles(principal, startDate, closeDate, expenseCode, payYnCode, statusCheckYn, searchText));
    }

    /** pay.Pay50_Expense.selectNewExpenseAppr (targetType SETTLE) */
    @GetMapping("/new-settles")
    public ApiResponse<List<ExpenseNewRes>> newSettles(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam(required = false) String expenseCode,
                                                       @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.newSettles(principal, expenseCode, searchText));
    }

    /** pay.Pay50_Expense.updateSettleEmpId — [자금집행 예정내역 가져오기] */
    @PutMapping("/take-settles")
    public ApiResponse<Integer> takeSettles(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ExpenseNewRes> rows) {
        return ApiResponse.ok(service.takeSettles(principal, rows));
    }

    /** pay.Pay50_Expense.update — [저장] */
    @PutMapping("/settles")
    public ApiResponse<Integer> saveSettles(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ExpenseSettleSaveReq> rows) {
        return ApiResponse.ok(service.saveSettles(principal, rows));
    }

    /** pay.Pay50_Expense.updateDeposit — [일괄저장] */
    @PutMapping("/settle-deposit")
    public ApiResponse<Integer> updateDeposit(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ExpenseDepositReq req) {
        return ApiResponse.ok(service.updateDeposit(principal, req));
    }

    /** pay.Pay50_Expense.initExpenseSettle — [삭제] */
    @PostMapping("/init-settle")
    public ApiResponse<Integer> initSettles(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.initSettles(principal, ids));
    }

    /** sys.Sys99_Print.insertRdExpensePay — [엑셀다운로드] 그룹 ID */
    @PostMapping("/rd-settle-print")
    public ApiResponse<String> rdSettlePrint(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ExpenseSettlePrintReq req) {
        return ApiResponse.ok(service.printSettles(principal, req));
    }

    // ── U12 사업비발생현황(Pay50_Tab_AccountSumList) ──

    /** pay.Pay50_Expense.selectExpenseAccountSum — 검색어는 서버가 "%…%"로 감싼다 */
    @GetMapping("/account-sums")
    public ApiResponse<List<ExpenseAccountSumRes>> searchAccountSums(@AuthenticationPrincipal UserPrincipal principal,
                                                                     @RequestParam String year,
                                                                     @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchAccountSums(principal, year, searchText));
    }

    /** sys.Sys99_Print.insertRdAccountSumList — [엑셀다운로드] 그룹 ID */
    @PostMapping("/rd-account-sum-print")
    public ApiResponse<String> rdAccountSumPrint(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam String year,
                                                 @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.printAccountSums(principal, year, searchText));
    }

    // ── U09 사업비 회계처리(Pay50_Tab_ExpenseJournal) ──

    /** pay.Pay50_Expense.selectExpenseJournal */
    @GetMapping("/journals")
    public ApiResponse<List<ExpenseJournalRes>> searchJournals(@AuthenticationPrincipal UserPrincipal principal,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                               @RequestParam(required = false) String expenseCode,
                                                               @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchJournals(principal, startDate, closeDate, expenseCode, searchText));
    }

    /** pay.Pay50_Expense.selectNewExpenseAppr (targetType JOURNAL) — 회계처리 대상(전표 없는 내역) */
    @GetMapping("/new-journals")
    public ApiResponse<List<ExpenseNewRes>> newJournals(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(required = false) String expenseCode,
                                                        @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.newJournals(principal, expenseCode, searchText));
    }

    /** pay.Pay50_Expense.updateAccountCode — 회계처리 대상의 [저장]·[일괄저장] */
    @PutMapping("/account-codes")
    public ApiResponse<Integer> updateAccountCodes(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody ExpenseAccountCodeReq req) {
        return ApiResponse.ok(service.updateAccountCodes(principal, req));
    }

    /** pay.Pay50_Expense.createJournal — [전표생성] */
    @PostMapping("/journals")
    public ApiResponse<Void> createJournals(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody ExpenseJournalCreateReq req) {
        service.createJournals(principal, req);
        return ApiResponse.ok(null);
    }

    /** pay.Pay50_Expense.deleteJournal — [삭제] (전표 ID 목록) */
    @PostMapping("/delete-journals")
    public ApiResponse<Integer> deleteJournals(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> journalIds) {
        return ApiResponse.ok(service.deleteJournals(principal, journalIds));
    }

    /** pay.Pay50_Expense.selectBySettleDate */
    @GetMapping("/settle-apprs")
    public ApiResponse<List<ExpenseSettleApprRes>> searchBySettleDate(@AuthenticationPrincipal UserPrincipal principal,
                                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                      @RequestParam(defaultValue = "false") boolean statusCheckYn,
                                                                      @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchBySettleDate(principal, startDate, closeDate, statusCheckYn, searchText));
    }

    /** pay.Pay50_Expense.selectBySettleApprId */
    @GetMapping("/settle-apprs/{settleApprId}")
    public ApiResponse<List<ExpenseSettleApprRowRes>> searchBySettleApprId(@AuthenticationPrincipal UserPrincipal principal,
                                                                           @PathVariable Long settleApprId) {
        return ApiResponse.ok(service.searchBySettleApprId(principal, settleApprId));
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
