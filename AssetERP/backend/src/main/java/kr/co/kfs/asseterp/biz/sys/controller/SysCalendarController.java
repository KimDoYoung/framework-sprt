package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CalendarRes;
import kr.co.kfs.asseterp.biz.sys.dto.CalendarSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysCalendarService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 일자관리 (AS-IS Sys12_Tab_Calendar·Sys12_Lookup_Customer → server/sys/Sys12_Calendar) */
@RestController
@RequestMapping("/api/v1/sys/calendars")
@RequiredArgsConstructor
public class SysCalendarController {

    private final SysCalendarService service;

    /** AS-IS sys.Sys12_Calendar.selectByYear (month 없음·'%' = 전체) */
    @GetMapping
    public ApiResponse<List<CalendarRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam String year,
                                                 @RequestParam(required = false) String month) {
        return ApiResponse.ok(service.search(principal, year, month));
    }

    /** AS-IS sys.Sys12_Calendar.selectBizDate (펀드별 자산 조회 등 기준일 초기값 — type "-1" = 전 영업일) */
    @GetMapping("/biz-date")
    public ApiResponse<String> bizDate(@AuthenticationPrincipal UserPrincipal principal,
                                       @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate stdDate,
                                       @RequestParam(defaultValue = "-1") String type) {
        return ApiResponse.ok(service.bizDate(principal, stdDate, type));
    }

    /** AS-IS sys.Sys12_Calendar.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<CalendarRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<CalendarSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys12_Calendar.insertAuto: 그 해의 일자를 지우고 다시 만든다 */
    @PostMapping("/generate")
    public ApiResponse<Void> generate(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String year) {
        service.generate(principal, year);
        return ApiResponse.ok(null);
    }

    /** AS-IS sys.Sys12_Calendar.selectByDay (고객사반영 — 관리자만) */
    @GetMapping("/customers")
    public ApiResponse<List<CalendarRes>> searchByDay(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String day) {
        return ApiResponse.ok(service.searchByDay(principal, day));
    }

    /** AS-IS sys.Sys12_Calendar.update·updateList (고객사반영 — 관리자만) → 저장한 행 수 */
    @PutMapping("/customers")
    public ApiResponse<Integer> updateCustomers(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<CalendarSaveReq> rows) {
        return ApiResponse.ok(service.updateCustomers(principal, rows));
    }
}
