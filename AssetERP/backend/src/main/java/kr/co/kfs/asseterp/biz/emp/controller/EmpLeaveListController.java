package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveListDownloadReq;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveListRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpLeaveListService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 휴가신청조회 (AS-IS Emp20_Tab_LeaveList, 메뉴 #1034) */
@RestController
@RequestMapping("/api/v1/emp/leave-list")
@RequiredArgsConstructor
public class EmpLeaveListController {

    private final EmpLeaveListService service;

    /** AS-IS emp.Emp20_Leave.selectByPersonName */
    @GetMapping
    public ApiResponse<List<LeaveListRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam(required = false) String personName,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.search(principal, personName, startDate, closeDate));
    }

    /** AS-IS sys.Sys99_Print.insertRdLeaveList → rdGroupId */
    @PostMapping("/rd-download")
    public ApiResponse<String> rdDownload(@AuthenticationPrincipal UserPrincipal principal, @RequestBody LeaveListDownloadReq req) {
        return ApiResponse.ok(service.insertRdDownload(principal, req.personName(), req.startDate(), req.closeDate()));
    }
}
