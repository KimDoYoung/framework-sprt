package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.GenLedgerRdReq;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerRes;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerSummaryReq;
import kr.co.kfs.asseterp.biz.act.service.ActGenLedgerService;
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

/** 계정원장 Act04_Tab_GenLedger (X18) — AS-IS Act04_GenLedger.selectByStdDate1·2 · selectByAccountCode · summaryGenLedger · Sys99_Print.insertRdGenLedger */
@RestController
@RequestMapping("/api/v1/act/gen-ledgers")
@RequiredArgsConstructor
public class ActGenLedgerListController {

    private final ActGenLedgerService service;

    /** 월별(diffType 1)·분기별(3)은 selectByStdDate1, 일별(2)은 selectByStdDate2 */
    @GetMapping
    public ApiResponse<List<GenLedgerRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                  @RequestParam String diffType,
                                                  @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchGenLedgers(principal, stdDate, diffType, searchText));
    }

    /** 하위계정정보 (Act04_Lookup_GenLedger) */
    @GetMapping("/by-account")
    public ApiResponse<List<GenLedgerRes>> byAccount(@AuthenticationPrincipal UserPrincipal principal,
                                                     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                     @RequestParam String accountCode) {
        return ApiResponse.ok(service.searchGenLedgersByAccount(principal, stdDate, accountCode));
    }

    /** 계정원장 정리 */
    @PostMapping("/summary")
    public ApiResponse<Void> summary(@AuthenticationPrincipal UserPrincipal principal, @RequestBody GenLedgerSummaryReq req) {
        service.summaryGenLedger(principal, req);
        return ApiResponse.ok(null);
    }

    /** 출력 준비 → 출력그룹ID */
    @PostMapping("/rd")
    public ApiResponse<Long> rd(@AuthenticationPrincipal UserPrincipal principal, @RequestBody GenLedgerRdReq req) {
        return ApiResponse.ok(service.insertRdGenLedger(principal, req));
    }
}
