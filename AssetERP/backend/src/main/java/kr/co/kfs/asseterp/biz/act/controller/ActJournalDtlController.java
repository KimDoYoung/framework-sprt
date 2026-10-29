package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.JournalDtlRes;
import kr.co.kfs.asseterp.biz.act.dto.JournalPayMonthRes;
import kr.co.kfs.asseterp.biz.act.service.ActJournalDtlService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 급여 전표확인 Pay10_Lookup_Journal (S18) — AS-IS act.Act03_JournalDtl */
@RestController
@RequestMapping("/api/v1/act/journal-dtls")
@RequiredArgsConstructor
public class ActJournalDtlController {

    private final ActJournalDtlService service;

    /** act.Act03_JournalDtl.selectPayMonth (payType = 월급여지급구분 PayMonthCode) */
    @GetMapping("/pay-month")
    public ApiResponse<List<JournalPayMonthRes>> payMonth(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate payDate,
                                                          @RequestParam String payType) {
        return ApiResponse.ok(service.searchPayMonth(principal, payDate, payType));
    }

    /** act.Act03_JournalDtl.selectByAstId (U01 일일자금관리 입금·출금 그리드) — drCrType D 입금 / C 출금 */
    @GetMapping("/by-ast")
    public ApiResponse<List<JournalDtlRes>> byAst(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                  @RequestParam Long astId, @RequestParam String drCrType) {
        return ApiResponse.ok(service.searchByAstId(principal, date, astId, drCrType));
    }
}
