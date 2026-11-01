package kr.co.kfs.asseterp.biz.ast.controller;

import kr.co.kfs.asseterp.biz.ast.dto.FinanceOprRes;
import kr.co.kfs.asseterp.biz.ast.dto.FinanceOprTrRes;
import kr.co.kfs.asseterp.biz.ast.dto.InvestAssetLimitRes;
import kr.co.kfs.asseterp.biz.ast.dto.OwnerCapitalMaxRes;
import kr.co.kfs.asseterp.biz.ast.service.AstFinanceOprService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/**
 * 금융상품 운용내역 W15 (Ast09_Tab_FinanceBookOpr, 메뉴 #1300) — 투자한도 현황·보유/평가 내역·종목별 매수/매도, 출력용 자료.
 * periodType: 미보유 포함이 아니면 0, 포함이면 1(1개월전)·2(3개월전)·3(1년전)·4(기간지정, startDate~closeDate)
 */
@RestController
@RequestMapping("/api/v1/ast/finance-opr")
@RequiredArgsConstructor
public class AstFinanceOprController {

    private final AstFinanceOprService service;

    /** ast.Ast40_OwnerCapital.selectByMaxDate — 해당 없으면 data null */
    @GetMapping("/owner-capital")
    public ApiResponse<OwnerCapitalMaxRes> ownerCapital(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate) {
        return ApiResponse.ok(service.ownerCapitalMax(principal, holdDate));
    }

    /** ast.Ast09_Book.selectInvestAssetLimit */
    @GetMapping("/limits")
    public ApiResponse<List<InvestAssetLimitRes>> limits(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate) {
        return ApiResponse.ok(service.investLimits(principal, holdDate));
    }

    /** ast.Ast09_Book.selectFinanceByHoldDate */
    @GetMapping
    public ApiResponse<List<FinanceOprRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                                   @RequestParam(defaultValue = "") String searchText,
                                                   @RequestParam(defaultValue = "") String investAssetType,
                                                   @RequestParam(defaultValue = "false") boolean holdYn,
                                                   @RequestParam(defaultValue = "0") String periodType,
                                                   @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                   @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.search(principal, holdDate, searchText, investAssetType, holdYn,
                AstFinanceOprService.periodType(holdYn, periodType), startDate, closeDate));
    }

    /** ast.Ast06_Tr.selectByAstClassTreeId — trType 1 매수내역 / 2 매도내역 (Ast06_TabPage_FinanceBookOpr) */
    @GetMapping("/trs")
    public ApiResponse<List<FinanceOprTrRes>> trs(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                  @RequestParam Long astClassTreeId,
                                                  @RequestParam Long keepAccountId,
                                                  @RequestParam String trType) {
        return ApiResponse.ok(service.trs(principal, stdDate, astClassTreeId, keepAccountId, trType));
    }

    /** sys.Sys99_Print.insertRdFinanceBookOpr1 → investLimitGroupId */
    @PostMapping("/rd-limit")
    public ApiResponse<Long> rdLimit(@AuthenticationPrincipal UserPrincipal principal,
                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate) {
        return ApiResponse.ok(service.insertRdLimit(principal, holdDate));
    }

    /** sys.Sys99_Print.insertRdFinanceBookOpr2 → bookGroupId (rdGroupId) */
    @PostMapping("/rd-book")
    public ApiResponse<Long> rdBook(@AuthenticationPrincipal UserPrincipal principal,
                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate holdDate,
                                    @RequestParam(defaultValue = "") String searchText,
                                    @RequestParam(defaultValue = "") String investAssetType,
                                    @RequestParam(defaultValue = "false") boolean holdYn,
                                    @RequestParam(defaultValue = "0") String periodType,
                                    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.insertRdBook(principal, holdDate, searchText, investAssetType, holdYn,
                AstFinanceOprService.periodType(holdYn, periodType), startDate, closeDate));
    }
}
