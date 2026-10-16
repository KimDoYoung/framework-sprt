package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EventRes;
import kr.co.kfs.asseterp.biz.emp.dto.EventSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpEventService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 행사내역 탭 (AS-IS Emp12_TabPage_Event → server/emp/emp12_event.xml) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpEventController {

    private final EmpEventService empEventService;

    @GetMapping("/persons/{personId}/events")
    public ApiResponse<List<EventRes>> getEvents(@AuthenticationPrincipal UserPrincipal principal,
                                                 @PathVariable Long personId) {
        return ApiResponse.ok(empEventService.getEvents(principal, personId));
    }

    @PutMapping("/events")
    public ApiResponse<List<EventRes>> updateEvents(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestBody List<EventSaveReq> rows) {
        return ApiResponse.ok(empEventService.updateEvents(principal, rows));
    }

    @DeleteMapping("/events")
    public ApiResponse<Integer> deleteEvents(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestBody List<Long> eventIds) {
        return ApiResponse.ok(empEventService.deleteEvents(principal, eventIds));
    }
}
