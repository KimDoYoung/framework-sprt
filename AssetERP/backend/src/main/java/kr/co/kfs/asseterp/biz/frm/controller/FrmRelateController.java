package kr.co.kfs.asseterp.biz.frm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateBookingRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateLeaveRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateMyScheduleRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateNoticeRes;
import kr.co.kfs.asseterp.biz.frm.dto.FrmRelateOrgScheduleRes;
import kr.co.kfs.asseterp.biz.frm.service.FrmRelateService;
import kr.co.kfs.asseterp.biz.mkt.dto.MktHistoryRes;
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

/** MyPage 일정 박스 (AS-IS frm/Monitoring_Page_Relate — 나의일정·부서일정·업무활동·알림·자리비움·예약). stdDate 'yyyy-MM-dd', 없으면 오늘 */
@RestController
@RequestMapping("/api/v1/frm/relates")
@RequiredArgsConstructor
public class FrmRelateController {

    private final FrmRelateService service;

    /** AS-IS sch.Sch01_Info.selectMyPageSchedule */
    @GetMapping("/my-schedules")
    public ApiResponse<List<FrmRelateMyScheduleRes>> searchMySchedule(@AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.searchMySchedule(principal, stdDate));
    }

    /** AS-IS sch.Sch01_Info.selectMyPageOrgSchedule */
    @GetMapping("/org-schedules")
    public ApiResponse<List<FrmRelateOrgScheduleRes>> searchOrgSchedule(@AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.searchOrgSchedule(principal, stdDate));
    }

    /** AS-IS mkt.Mkt03_History.selectByRegDate */
    @GetMapping("/histories")
    public ApiResponse<List<MktHistoryRes>> searchHistory(@AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.searchHistory(principal, stdDate));
    }

    /** AS-IS bbs.Bbs02_Notice.selectPersonNotice */
    @GetMapping("/notices")
    public ApiResponse<List<FrmRelateNoticeRes>> searchNotice(@AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.searchNotice(principal, stdDate));
    }

    /** AS-IS emp.Emp20_Leave.selectByDate (shareCheck=true) */
    @GetMapping("/leaves")
    public ApiResponse<List<FrmRelateLeaveRes>> searchLeave(@AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.searchLeave(principal, stdDate));
    }

    /** AS-IS mrb.Mrb01_Booking.selectByBookingDate */
    @GetMapping("/bookings")
    public ApiResponse<List<FrmRelateBookingRes>> searchBooking(@AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate) {
        return ApiResponse.ok(service.searchBooking(principal, stdDate));
    }
}
