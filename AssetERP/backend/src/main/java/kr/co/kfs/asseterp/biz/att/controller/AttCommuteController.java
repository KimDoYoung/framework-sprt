package kr.co.kfs.asseterp.biz.att.controller;

import kr.co.kfs.asseterp.biz.att.dto.AttCommuteAutoReq;
import kr.co.kfs.asseterp.biz.att.dto.AttCommuteBatchReq;
import kr.co.kfs.asseterp.biz.att.dto.AttCommuteHistReq;
import kr.co.kfs.asseterp.biz.att.dto.AttCommuteRes;
import kr.co.kfs.asseterp.biz.att.dto.AttMyCheckOutTimeReq;
import kr.co.kfs.asseterp.biz.att.dto.AttMyCommuteLastRes;
import kr.co.kfs.asseterp.biz.att.dto.AttMyCommuteReasonReq;
import kr.co.kfs.asseterp.biz.att.dto.AttMyCommuteReq;
import kr.co.kfs.asseterp.biz.att.dto.AttMyCommuteRes;
import kr.co.kfs.asseterp.biz.att.service.AttCommuteHistService;
import kr.co.kfs.asseterp.biz.att.service.AttCommuteService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 근태관리(관리자) (AS-IS Att02_Tab_CommuteAdmin #1485 · Att02_Lookup_InsertBatch · Att02_Edit_Commute·CommuteBatch → server/att/Att02_Commute·Att04_CommuteHist) */
@RestController
@RequestMapping("/api/v1/att/commutes")
@RequiredArgsConstructor
public class AttCommuteController {

    private final AttCommuteService service;
    private final AttCommuteHistService histService;

    /** AS-IS att.Att02_Commute.selectByTextAdmin — baseDate가 있으면 하루, 없으면 startDate~closeDate */
    @GetMapping("/admin")
    public ApiResponse<List<AttCommuteRes>> searchAdmin(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(required = false) Long personId,
                                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate,
                                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                        @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchAdmin(principal, personId, baseDate, startDate, closeDate, searchText));
    }

    /** AS-IS att.Att02_Commute.adminCheck */
    @PutMapping("/{commuteId}/admin-check")
    public ApiResponse<Integer> adminCheck(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long commuteId) {
        return ApiResponse.ok(service.adminCheck(principal, commuteId));
    }

    /** AS-IS att.Att02_Commute.insertBatch */
    @PostMapping("/batch")
    public ApiResponse<Integer> insertBatch(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AttCommuteBatchReq req) {
        return ApiResponse.ok(service.insertBatch(principal, req));
    }

    /** AS-IS att.Att04_CommuteHist.updateAuto (근로시간 일괄조정) */
    @PutMapping("/auto-adjust")
    public ApiResponse<Integer> updateAuto(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AttCommuteAutoReq req) {
        return ApiResponse.ok(histService.updateAuto(principal, req));
    }

    /** AS-IS att.Att04_CommuteHist.insert (개별수정, 변경사유 "개별수정") */
    @PutMapping("/{commuteId}/time")
    public ApiResponse<Integer> updateTime(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long commuteId,
                                           @RequestBody AttCommuteHistReq req) {
        return ApiResponse.ok(histService.insertList(principal,
                new AttCommuteHistReq(List.of(commuteId), req.checkInTime(), req.checkInTimeStr(), req.checkOutTime(), req.checkOutTimeStr()),
                "개별수정"));
    }

    /** AS-IS att.Att04_CommuteHist.insertList (일괄수정, 변경사유 "일괄수정") */
    @PutMapping("/time")
    public ApiResponse<Integer> updateTimes(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AttCommuteHistReq req) {
        return ApiResponse.ok(histService.insertList(principal, req, "일괄수정"));
    }

    // ── 로그인 사원 본인의 출퇴근 (AS-IS Att02_Lookup_Commute · Att02_Edit_Reason · Att02_Edit_CheckOutTime, EE50) ──

    /** AS-IS att.Att02_Commute.getLastInfo (+ 회사 근태 설정) */
    @GetMapping("/me/last-info")
    public ApiResponse<AttMyCommuteLastRes> getLastInfo(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getLastInfo(principal));
    }

    /** AS-IS att.Att02_Commute.selectByDate (baseDate 없으면 오늘) */
    @GetMapping("/me")
    public ApiResponse<List<AttMyCommuteRes>> searchByDate(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(service.searchByDate(principal, baseDate));
    }

    /** AS-IS att.Att02_Commute.insert — 1 성공 / -1 이미 처리됨 / -2 출근 기록 없음 */
    @PostMapping("/me/check")
    public ApiResponse<Integer> checkInOut(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AttMyCommuteReq req) {
        return ApiResponse.ok(service.checkInOut(principal, Boolean.TRUE.equals(req.on()), req.baseDate()));
    }

    /** AS-IS att.Att02_Commute.insertOffWork — 1 성공 / -2 출근 기록 없음 */
    @PostMapping("/me/off-work")
    public ApiResponse<Integer> offWork(@AuthenticationPrincipal UserPrincipal principal, @RequestBody AttMyCommuteReq req) {
        return ApiResponse.ok(service.offWork(principal, req.baseDate()));
    }

    /** AS-IS att.Att02_Commute.updateReason */
    @PutMapping("/me/{commuteId}/reason")
    public ApiResponse<Integer> updateReason(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long commuteId,
                                             @RequestBody AttMyCommuteReasonReq req) {
        return ApiResponse.ok(service.updateReason(principal, commuteId, req.actionCode(), req.reason()));
    }

    /** AS-IS att.Att02_Commute.updateCheckOutTime */
    @PutMapping("/me/{commuteId}/check-out-time")
    public ApiResponse<Integer> updateCheckOutTime(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long commuteId,
                                                   @RequestBody AttMyCheckOutTimeReq req) {
        return ApiResponse.ok(service.updateCheckOutTime(principal, commuteId, req.checkOutTime(), req.checkOutTimeStr()));
    }
}
