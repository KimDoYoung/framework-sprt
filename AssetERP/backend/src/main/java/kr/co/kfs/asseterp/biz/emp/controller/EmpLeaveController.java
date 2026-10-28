package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EtcLeaveRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveDaysRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveDownloadReq;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveOptionRes;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveOverConfirmReq;
import kr.co.kfs.asseterp.biz.emp.dto.LeaveRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpLeaveService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 휴가관리(경영관리팀) (AS-IS Emp20_Tab_LeaveManager → server/emp/Emp20_Leave · Emp22_EtcLeave) */
@RestController
@RequestMapping("/api/v1/emp")
@RequiredArgsConstructor
public class EmpLeaveController {

    private final EmpLeaveService service;

    /** AS-IS emp.Emp20_Leave.selectByPersonId (managerYn=true) */
    @GetMapping("/leaves")
    public ApiResponse<List<LeaveRes>> searchLeaves(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam Long personId, @RequestParam String stdYear) {
        return ApiResponse.ok(service.searchLeaves(principal, personId, stdYear));
    }

    /** AS-IS emp.Emp20_Leave.selectByDays + emp.Emp22_EtcLeave.selectByDays */
    @GetMapping("/leaves/days")
    public ApiResponse<LeaveDaysRes> getDays(@AuthenticationPrincipal UserPrincipal principal,
                                             @RequestParam Long personId, @RequestParam String stdYear) {
        return ApiResponse.ok(service.getDays(principal, personId, stdYear));
    }

    /** 로그인 회사의 초과휴가 설정 */
    @GetMapping("/leaves/option")
    public ApiResponse<LeaveOptionRes> getOption(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getOption(principal));
    }

    /** AS-IS emp.Emp20_Leave.updateOverConfirm */
    @PutMapping("/leaves/{leaveId}/over-confirm")
    public ApiResponse<LeaveRes> updateOverConfirm(@AuthenticationPrincipal UserPrincipal principal,
                                                   @PathVariable Long leaveId, @RequestBody LeaveOverConfirmReq req) {
        return ApiResponse.ok(service.updateOverConfirm(principal, leaveId, req));
    }

    /** AS-IS sys.Sys99_Print.insertRdLeaveManager → rdGroupId */
    @PostMapping("/leaves/rd-download")
    public ApiResponse<String> rdDownload(@AuthenticationPrincipal UserPrincipal principal, @RequestBody LeaveDownloadReq req) {
        return ApiResponse.ok(service.insertRdDownload(principal, req));
    }

    /** AS-IS emp.Emp22_EtcLeave.selectByPersonId (포상휴가 보기) */
    @GetMapping("/etc-leaves")
    public ApiResponse<List<EtcLeaveRes>> searchEtcLeaves(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam Long personId, @RequestParam String stdYear) {
        return ApiResponse.ok(service.searchEtcLeaves(principal, personId, stdYear));
    }
}
