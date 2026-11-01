package kr.co.kfs.asseterp.biz.act.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.act.dto.JournalFixReq;
import kr.co.kfs.asseterp.biz.act.dto.JournalFixRes;
import kr.co.kfs.asseterp.biz.act.service.ActJournalFixService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 전표승인처리 Act02_Tab_JournalFix (X02, 메뉴 #1207) — AS-IS act.Act02_Journal */
@RestController
@RequestMapping("/api/v1/act/journal-fixes")
@RequiredArgsConstructor
public class ActJournalFixController {

    private final ActJournalFixService service;

    /** act.Act02_Journal.selectByDateAll */
    @GetMapping
    public ApiResponse<List<JournalFixRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                   @RequestParam(required = false) String searchText,
                                                   @RequestParam(required = false) Long corpId,
                                                   @RequestParam(required = false) String trCode,
                                                   @RequestParam(defaultValue = "false") boolean unFixYn,
                                                   @RequestParam(required = false) String trOccType) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, searchText, corpId, trCode, unFixYn, trOccType));
    }

    /** act.Act02_Journal.selectById */
    @GetMapping("/{journalId}")
    public ApiResponse<JournalFixRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long journalId) {
        return ApiResponse.ok(service.get(principal, journalId));
    }

    /** act.Act02_Journal.updateFixYn → 바뀐 전표 */
    @PostMapping("/confirm")
    public ApiResponse<List<JournalFixRes>> confirm(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody JournalFixReq req) {
        return ApiResponse.ok(service.updateFixYn(principal, req.procType(), req.journalIds()));
    }
}
