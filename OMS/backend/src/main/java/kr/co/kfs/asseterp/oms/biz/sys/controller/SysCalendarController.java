package kr.co.kfs.asseterp.oms.biz.sys.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CalendarRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CalendarSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.service.SysCalendarService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 일자관리 (AS-IS Sys12_Tab_Calendar → sys.Sys12_Calendar). 로그인 회사의 일자, 고객사반영은 KFS 관리자만 */
@RestController
@RequestMapping("/api/v1/sys/calendars")
@RequiredArgsConstructor
public class SysCalendarController {

    private final SysCalendarService sysCalendarService;

    @GetMapping
    public ApiResponse<List<CalendarRes>> searchCalendars(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam String year,
                                                          @RequestParam(required = false) String month) {
        return ApiResponse.ok(sysCalendarService.searchCalendars(principal.getCompanyId(), year, month));
    }

    @PutMapping
    public ApiResponse<List<CalendarRes>> updateCalendars(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestBody List<CalendarSaveReq> rows) {
        return ApiResponse.ok(sysCalendarService.updateCalendars(principal.getCompanyId(), rows));
    }

    /** 생성: 그 연도 일자를 지우고 다시 만든다 → 만든 일수 */
    @PostMapping("/generate")
    public ApiResponse<Integer> generateCalendars(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String year) {
        return ApiResponse.ok(sysCalendarService.generateCalendars(principal.getCompanyId(), year));
    }

    /** 고객사반영: 그 날의 사용 고객사 일자 */
    @GetMapping("/customers")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<CalendarRes>> searchCustomerCalendars(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day) {
        return ApiResponse.ok(sysCalendarService.searchCustomerCalendars(day));
    }

    /** 고객사반영 저장 (회사 조건 없음) */
    @PutMapping("/customers")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<CalendarRes>> updateCustomerCalendars(@RequestBody List<CalendarSaveReq> rows) {
        return ApiResponse.ok(sysCalendarService.updateCalendars(null, rows));
    }
}
