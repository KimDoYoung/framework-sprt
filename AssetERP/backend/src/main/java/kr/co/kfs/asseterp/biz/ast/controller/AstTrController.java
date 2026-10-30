package kr.co.kfs.asseterp.biz.ast.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.ast.dto.Tr4InsureLedgerRes;
import kr.co.kfs.asseterp.biz.ast.dto.Tr4InsureSaveReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrApprReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrDeleteReq;
import kr.co.kfs.asseterp.biz.ast.dto.TrRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrTaxLedgerRes;
import kr.co.kfs.asseterp.biz.ast.dto.TrTaxSaveReq;
import kr.co.kfs.asseterp.biz.ast.service.AstTrService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
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

/** 세금/4대보험 등록 Ast06_Tab_TrTax (U04) — AS-IS ast.Ast06_Tr · ast.Ast20_TrTax · ast.Ast21_Tr4Insure */
@RestController
@RequestMapping("/api/v1/ast")
@RequiredArgsConstructor
public class AstTrController {

    private final AstTrService service;

    /** ast.Ast06_Tr.selectTaxTr — trCode 없으면 전체 */
    @GetMapping("/trs/tax")
    public ApiResponse<List<TrRes>> searchTaxTrs(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                 @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                 @RequestParam(required = false) String trCode) {
        return ApiResponse.ok(service.searchTaxTrs(principal, startDate, closeDate, trCode));
    }

    /** ast.Ast06_Tr.selectById */
    @GetMapping("/trs/{trId}")
    public ApiResponse<TrRes> getTr(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long trId) {
        return ApiResponse.ok(service.getTr(principal, trId));
    }

    /** ast.Ast06_Tr.updateTax — 저장한 거래ID */
    @PutMapping("/trs/tax")
    public ApiResponse<Long> saveTax(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody TrTaxSaveReq req) {
        return ApiResponse.ok(service.saveTax(principal, req));
    }

    /** ast.Ast06_Tr.update4Insure — 저장한 거래ID */
    @PutMapping("/trs/4insure")
    public ApiResponse<Long> save4Insure(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody Tr4InsureSaveReq req) {
        return ApiResponse.ok(service.save4Insure(principal, req));
    }

    /** ast.Ast06_Tr.delete */
    @PostMapping("/trs/delete")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody TrDeleteReq req) {
        service.delete(principal, req.trIds());
        return ApiResponse.ok(null);
    }

    /** ast.Ast06_Tr.updateApprId */
    @PutMapping("/trs/{trId}/appr")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long trId,
                                          @Valid @RequestBody TrApprReq req) {
        service.updateApprId(principal, trId, req.apprId());
        return ApiResponse.ok(null);
    }

    /** ast.Ast20_TrTax.selectGenLedgerTax */
    @GetMapping("/tr-taxes/gen-ledger")
    public ApiResponse<TrTaxLedgerRes> genLedgerTax(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                    @RequestParam String trCode) {
        return ApiResponse.ok(service.getGenLedgerTax(principal, date, trCode));
    }

    /** ast.Ast21_Tr4Insure.selectGenLedgerInsure */
    @GetMapping("/tr-4insures/gen-ledger")
    public ApiResponse<Tr4InsureLedgerRes> genLedgerInsure(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.ok(service.getGenLedgerInsure(principal, date));
    }
}
