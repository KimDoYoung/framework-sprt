package kr.co.kfs.asseterp.biz.sms.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryMonthRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryYearRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryRes;
import kr.co.kfs.asseterp.biz.sms.dto.HistoryTotalRes;
import kr.co.kfs.asseterp.biz.sms.service.SmsHistoryService;
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

/** 고객별 문자사용량 (AS-IS Sms02_Tab_TotalCount → server/sms/Sms02_History) */
@RestController
@RequestMapping("/api/v1/sms")
@RequiredArgsConstructor
public class SmsHistoryController {

    private final SmsHistoryService service;

    /** AS-IS sms.Sms02_History.selectByTotalCount */
    @GetMapping("/history-totals")
    public ApiResponse<List<HistoryTotalRes>> getTotals(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(defaultValue = "true") boolean useYn) {
        return ApiResponse.ok(service.selectByTotalCount(principal, useYn));
    }

    /** AS-IS sms.Sms02_History.selectByTotalCountYear */
    @GetMapping("/history-totals/years")
    public ApiResponse<List<HistoryYearRes>> getYears(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String locName) {
        return ApiResponse.ok(service.selectByTotalCountYear(principal, locName));
    }

    /** AS-IS sms.Sms02_History.selectByTotalCountMonth */
    @GetMapping("/history-totals/months")
    public ApiResponse<List<HistoryMonthRes>> getMonths(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam String locName, @RequestParam String year) {
        return ApiResponse.ok(service.selectByTotalCountMonth(principal, locName, year));
    }

    /** AS-IS sms.Sms02_History.selectByDate (최근 300건) */
    @GetMapping("/histories")
    public ApiResponse<List<HistoryRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long companyId,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.selectByDate(principal, companyId, startDate, closeDate, searchText));
    }
}
