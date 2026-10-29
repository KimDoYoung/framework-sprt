package kr.co.kfs.asseterp.biz.att.controller;

import kr.co.kfs.asseterp.biz.att.dto.AttCommuteAutoReq;
import kr.co.kfs.asseterp.biz.att.dto.AttCommuteBatchReq;
import kr.co.kfs.asseterp.biz.att.dto.AttCommuteHistReq;
import kr.co.kfs.asseterp.biz.att.dto.AttCommuteRes;
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
}
