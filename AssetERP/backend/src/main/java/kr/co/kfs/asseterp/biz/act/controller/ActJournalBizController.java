package kr.co.kfs.asseterp.biz.act.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizLineRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalBizRes;
import kr.co.kfs.asseterp.biz.act.service.ActJournalBizService;
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

/** 급여/카드 회계처리 Act02_Tab_CreateJournalBiz (U10) — AS-IS act.Act02_Journal · act.Act03_JournalDtl */
@RestController
@RequestMapping("/api/v1/act/journal-bizs")
@RequiredArgsConstructor
public class ActJournalBizController {

    private final ActJournalBizService service;

    /** act.Act02_Journal.selectMonthBiz (stdMonth = "yyyy.MM") */
    @GetMapping
    public ApiResponse<List<JournalBizRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdMonth) {
        return ApiResponse.ok(service.searchMonth(principal, stdMonth));
    }

    /** act.Act03_JournalDtl.selectBizCard·selectChargeFee·selectErpChargeFee·selectByJournalId — 고른 행의 거래 코드로 가른다 */
    @GetMapping("/lines")
    public ApiResponse<List<JournalBizLineRes>> lines(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String stdMonth,
                                                      @RequestParam(required = false) String trCode, @RequestParam(required = false) String note,
                                                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                      @RequestParam(required = false) Long journalId) {
        return ApiResponse.ok(service.searchLines(principal, stdMonth, trCode, note, date, journalId));
    }

    /** act.Act02_Journal.createJournalBiz */
    @PostMapping("/create")
    public ApiResponse<Void> create(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody JournalBizReq req) {
        service.createJournals(principal, req);
        return ApiResponse.ok(null);
    }

    /** act.Act02_Journal.deleteJournalBiz */
    @PostMapping("/delete")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody JournalBizReq req) {
        service.deleteJournals(principal, req);
        return ApiResponse.ok(null);
    }
}
