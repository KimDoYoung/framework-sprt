package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.GenLedgerFssRdReq;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerReportRdReq;
import kr.co.kfs.asseterp.biz.act.dto.GenLedgerReportRes;
import kr.co.kfs.asseterp.biz.act.service.ActGenLedgerReportService;
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

/** 재무제표 Act04_Tab_ReportPL(X20)·Act04_Tab_ReportBS(X21) — AS-IS Act04_GenLedger.selectBSPL · Sys00_Common 비교일 · Sys99_Print.insertRdReportPL */
@RestController
@RequestMapping("/api/v1/act/gen-ledger-reports")
@RequiredArgsConstructor
public class ActGenLedgerReportController {

    private final ActGenLedgerReportService service;

    /** 재무제표 조회 — reportType 1 재무상태표 / 2 손익계산서 */
    @GetMapping
    public ApiResponse<List<GenLedgerReportRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate compareDate,
                                                        @RequestParam(defaultValue = "false") boolean exceptZeroYn,
                                                        @RequestParam String reportType) {
        return ApiResponse.ok(service.searchBSPL(principal, stdDate, compareDate, exceptZeroYn, reportType));
    }

    /** 비교기준(BsplCompareCode 1 전기말·2 반기·3 분기)에 따른 비교일자 */
    @GetMapping("/compare-date")
    public ApiResponse<LocalDate> compareDate(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                              @RequestParam String compareCode) {
        return ApiResponse.ok(service.searchCompareDate(principal, stdDate, compareCode));
    }

    /** 출력 준비 → 출력그룹ID */
    @PostMapping("/rd")
    public ApiResponse<Long> rd(@AuthenticationPrincipal UserPrincipal principal, @RequestBody GenLedgerReportRdReq req) {
        return ApiResponse.ok(service.insertRdReport(principal, req));
    }

    /** 금감원보고용 재무제표 출력 준비(X22) → 출력그룹ID. code GA023 재무상태표 / GA025 손익계산서 */
    @PostMapping("/fss-rd")
    public ApiResponse<Long> fssRd(@AuthenticationPrincipal UserPrincipal principal, @RequestBody GenLedgerFssRdReq req) {
        return ApiResponse.ok(service.insertRdReportFss(principal, req));
    }
}
