package kr.co.kfs.asseterp.biz.rpt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rpt.dto.DailyConfirmNoteReq;
import kr.co.kfs.asseterp.biz.rpt.dto.DailyConfirmReq;
import kr.co.kfs.asseterp.biz.rpt.dto.DailyConfirmRes;
import kr.co.kfs.asseterp.biz.rpt.dto.DailyPrintReq;
import kr.co.kfs.asseterp.biz.rpt.dto.DailyRes;
import kr.co.kfs.asseterp.biz.rpt.dto.DailySaveReq;
import kr.co.kfs.asseterp.biz.rpt.service.RptDailyService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 일일업무 입력 (AS-IS server/rpt/Rpt01_Daily, Z08 Rpt01_Tab_DailyWrite) */
@RestController
@RequestMapping("/api/v1/rpt/dailies")
@RequiredArgsConstructor
public class RptDailyController {

    private final RptDailyService service;

    /** AS-IS rpt.Rpt01_Daily.selectByText — 내 일일업무 */
    @GetMapping
    public ApiResponse<List<DailyRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                              @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByText(principal, startDate, closeDate, searchText));
    }

    /** AS-IS rpt.Rpt01_Daily.modelUpdate — 저장한 행 */
    @PutMapping
    public ApiResponse<DailyRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DailySaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS rpt.Rpt01_Daily.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    // ===== Z09 일일업무 확인 (Rpt01_Tab_DailyConfirm) =====

    /** AS-IS rpt.Rpt01_Daily.selectByConfirmText — 내 조직(하위 포함) 사원의 일일업무. unconfirmedOnly = 미확인건만 */
    @GetMapping("/confirm")
    public ApiResponse<List<DailyConfirmRes>> searchConfirm(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                            @RequestParam(defaultValue = "false") boolean unconfirmedOnly,
                                                            @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByConfirmText(principal, startDate, closeDate, unconfirmedOnly, searchText));
    }

    /** AS-IS rpt.Rpt01_Daily.confirmModelUpdate — 확인자 비고 → 저장한 행 */
    @PutMapping("/{dailyId}/confirm-note")
    public ApiResponse<DailyConfirmRes> saveConfirmNote(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long dailyId,
                                                        @RequestBody DailyConfirmNoteReq req) {
        return ApiResponse.ok(service.saveConfirmNote(principal, dailyId, req.confirmNote()));
    }

    /** AS-IS rpt.Rpt01_Daily.confirmUpdate — 확인(true)·확인취소(false) → 바꾼 건수 */
    @PutMapping("/confirm")
    public ApiResponse<Integer> confirm(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DailyConfirmReq req) {
        return ApiResponse.ok(service.confirm(principal, req.dailyIds(), req.confirmYn()));
    }

    /** AS-IS sys.Sys99_Print.insertRdDaily → 출력 그룹 ID (RD 리포트 rdGroupId) */
    @PostMapping("/confirm/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DailyPrintReq req) {
        return ApiResponse.ok(service.insertRdDaily(principal, req));
    }
}
