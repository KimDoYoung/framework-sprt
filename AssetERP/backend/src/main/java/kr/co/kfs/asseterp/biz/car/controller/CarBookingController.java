package kr.co.kfs.asseterp.biz.car.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingAdminReq;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingJournalReq;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingRes;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingSaveReq;
import kr.co.kfs.asseterp.biz.car.dto.CarBookingTimelineRes;
import kr.co.kfs.asseterp.biz.car.service.CarBookingService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 공용차량 예약관리 (AS-IS Car03_Tab_List·Car03_Tab_DayofMonth·Car03_Popup_BookingReg → server/car/Car03_Booking) */
@RestController
@RequestMapping("/api/v1/car/bookings")
@RequiredArgsConstructor
public class CarBookingController {

    private final CarBookingService service;

    /** AS-IS car.Car03_Booking.selectByList (오늘 이후 예약현황) */
    @GetMapping("/list")
    public ApiResponse<List<CarBookingRes>> searchList(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.searchList(principal));
    }

    /** AS-IS car.Car03_Booking.selectByDate — type 'all'(기본) / 'my' */
    @GetMapping
    public ApiResponse<List<CarBookingRes>> searchByDate(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                        @RequestParam(defaultValue = "all") String type) {
        return ApiResponse.ok(service.searchByDate(principal, date, type));
    }

    /** AS-IS car.Car03_Booking.selectByDateUnion (예약 팝업의 시간막대) */
    @GetMapping("/timeline")
    public ApiResponse<List<CarBookingTimelineRes>> timeline(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.ok(service.searchTimeline(principal, date));
    }

    /** AS-IS car.Car03_Booking.update / updateList → 저장된 첫 행 */
    @PutMapping
    public ApiResponse<CarBookingRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CarBookingSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS car.Car03_Booking.delete / deleteList(withChildren=true) */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids,
                                       @RequestParam(defaultValue = "false") boolean withChildren) {
        return ApiResponse.ok(service.delete(principal, ids, withChildren));
    }

    /** AS-IS car.Car03_Booking.updateAdmin / updateListAdmin (T15) → 만든 일지 건수 */
    @PostMapping("/admin")
    public ApiResponse<Integer> createAdmin(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CarBookingAdminReq req) {
        return ApiResponse.ok(service.createAdmin(principal, req));
    }

    /** AS-IS car.Car03_Booking.updateJournalModel (T15) */
    @PutMapping("/journal")
    public ApiResponse<CarBookingRes> updateJournal(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CarBookingJournalReq req) {
        return ApiResponse.ok(service.updateJournal(principal, req));
    }

    /** AS-IS car.Car03_Booking.deleteByJournalList + car.Car04_Journal.delete (T15) — 예약 ID 목록 */
    @DeleteMapping("/admin")
    public ApiResponse<Integer> deleteAdmin(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> bookingIds) {
        return ApiResponse.ok(service.deleteAdmin(principal, bookingIds));
    }
}
