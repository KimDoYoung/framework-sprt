package kr.co.kfs.asseterp.biz.act.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.act.dto.JournalCreateReq;
import kr.co.kfs.asseterp.biz.act.service.ActJournalService;
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

/** 세금/4대보험 등록 Ast06_Tab_TrTax (U04) — AS-IS act.Act02_Journal · act.Act04_GenLedger */
@RestController
@RequestMapping("/api/v1/act")
@RequiredArgsConstructor
public class ActJournalController {

    private final ActJournalService service;

    /** act.Act02_Journal.createJournal */
    @PostMapping("/journals/create")
    public ApiResponse<Void> create(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody JournalCreateReq req) {
        service.createJournal(principal, req.trId(), req.trCode(), req.procType(), req.exceptYn());
        return ApiResponse.ok(null);
    }

    /** act.Act04_GenLedger.checkClose — 마감이면 AS-IS 메시지로 실패 */
    @GetMapping("/gen-ledgers/close-check")
    public ApiResponse<Void> closeCheck(@AuthenticationPrincipal UserPrincipal principal,
                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        service.checkClose(principal.getCompanyId(), stdDate);
        return ApiResponse.ok(null);
    }
}
