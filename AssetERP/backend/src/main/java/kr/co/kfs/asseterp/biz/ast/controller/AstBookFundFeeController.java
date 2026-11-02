package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeCorpRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeFundRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeePeriodRes;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeStatePrintReq;
import kr.co.kfs.asseterp.biz.ast.dto.BookFundFeeStateRes;
import kr.co.kfs.asseterp.biz.ast.dto.PreHoldFeeRes;
import kr.co.kfs.asseterp.biz.ast.service.AstBookFundFeeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 펀드보수원장 현황 (AS-IS Ast30_Tab_OfficeMngFeeState → server/ast/Ast30_BookFundFee) — 메뉴 #1201 */
@RestController
@RequestMapping("/api/v1/ast/book-fund-fees")
@RequiredArgsConstructor
public class AstBookFundFeeController {

    private final AstBookFundFeeService service;

    /** AS-IS ast.Ast30_BookFundFee.selectByCompanyId — 운용사별 합계 */
    @GetMapping
    public ApiResponse<List<BookFundFeeCorpRes>> searchCorps(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                                             @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchCorps(principal, holdDate, searchText));
    }

    /** AS-IS ast.Ast30_BookFundFee.selectByHoldDatePaging — 기간의 일자·운용사별 합계 (X26 #1249) */
    @GetMapping("/period")
    public ApiResponse<PageRes<BookFundFeePeriodRes>> searchPeriod(@AuthenticationPrincipal UserPrincipal principal,
                                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                   @RequestParam(defaultValue = "") String searchText,
                                                                   @RequestParam(defaultValue = "0") int offset,
                                                                   @RequestParam(defaultValue = "100") int limit) {
        return ApiResponse.ok(service.searchPeriod(principal, startDate, closeDate, searchText, offset, limit));
    }

    /** AS-IS ast.Ast30_BookFundFee.selectFundFeeBook — 기간의 일자·펀드별 보수원장 (X31 #1216) */
    @GetMapping("/fund-fee-books")
    public ApiResponse<List<BookFundFeeStateRes>> searchFundFeeBook(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                    @RequestParam(required = false) String fundCode,
                                                                    @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchFundFeeBook(principal, startDate, closeDate, fundCode, searchText));
    }

    /** AS-IS sys.Sys99_Print.insertRdFundMngFeeState — [출력/다운로드] RD 자료 준비 → 출력 그룹 ID (X31) */
    @PostMapping("/fund-fee-books/rd")
    public ApiResponse<String> rdFundFeeBook(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BookFundFeeStatePrintReq req) {
        return ApiResponse.ok(service.insertRdFundMngFeeState(principal, req));
    }

    /** AS-IS ast.Ast30_BookFundFee.selectByCorpId — 한 운용사의 펀드별 */
    @GetMapping("/funds")
    public ApiResponse<List<BookFundFeeFundRes>> searchFunds(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                                             @RequestParam Long corpId,
                                                             @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchFunds(principal, holdDate, corpId, searchText));
    }

    /** AS-IS ast.Ast30_BookFundFee.selectByPreHoldDate — 기준일 전날 보수원장 (X28 보수원장 조회창) */
    @GetMapping("/pre-hold")
    public ApiResponse<List<PreHoldFeeRes>> searchPreHold(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                                          @RequestParam(required = false) Long corpId,
                                                          @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchPreHold(principal, holdDate, corpId, searchText));
    }
}
