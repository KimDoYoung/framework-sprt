package kr.co.kfs.asseterp.biz.mrb.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mrb.dto.MrbBookingRes;
import kr.co.kfs.asseterp.biz.mrb.dto.MrbBookingSaveReq;
import kr.co.kfs.asseterp.biz.mrb.dto.MrbBookingTimelineRes;
import kr.co.kfs.asseterp.biz.mrb.service.MrbBookingService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 회의실 예약관리 (AS-IS Mrb01_Tab_List·Mrb01_Tab_DayofMonth·Mrb01_Popup_MeetingRoomReg → server/mrb/Mrb01_Booking) */
@RestController
@RequestMapping("/api/v1/mrb/bookings")
@RequiredArgsConstructor
public class MrbBookingController {

    private final MrbBookingService service;

    /** AS-IS mrb.Mrb01_Booking.selectByList (오늘 이후 예약현황) */
    @GetMapping("/list")
    public ApiResponse<List<MrbBookingRes>> searchList(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchList(principal));
    }

    /** AS-IS mrb.Mrb01_Booking.selectByYearMonth (달력에 표시할 예약 있는 날) */
    @GetMapping("/marked-dates")
    public ApiResponse<List<LocalDate>> markedDates(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyyMM) {
        return ApiResponse.ok(service.searchMarkedDates(principal, yyyyMM));
    }

    /** AS-IS mrb.Mrb01_Booking.selectByDate — type 'all'(기본) / 'my' */
    @GetMapping
    public ApiResponse<List<MrbBookingRes>> searchByDate(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                        @RequestParam(defaultValue = "all") String type) {
        return ApiResponse.ok(service.searchByDate(principal, date, type));
    }

    /** AS-IS mrb.Mrb01_Booking.selectByDateUnion (예약 팝업의 시간막대) */
    @GetMapping("/timeline")
    public ApiResponse<List<MrbBookingTimelineRes>> timeline(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.ok(service.searchTimeline(principal, date));
    }

    /** AS-IS getSeq (Mrb01_Popup_MeetingRoomReg.open) */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS mrb.Mrb01_Booking.update / updateList → 저장된 첫 행 */
    @PutMapping
    public ApiResponse<MrbBookingRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MrbBookingSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS mrb.Mrb01_Booking.delete / deleteList(withChildren=true) */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids,
                                       @RequestParam(defaultValue = "false") boolean withChildren) {
        return ApiResponse.ok(service.delete(principal, ids, withChildren));
    }
}
