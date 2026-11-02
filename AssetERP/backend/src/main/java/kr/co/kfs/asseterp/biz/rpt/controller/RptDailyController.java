package kr.co.kfs.asseterp.biz.rpt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rpt.dto.DailyRes;
import kr.co.kfs.asseterp.biz.rpt.dto.DailySaveReq;
import kr.co.kfs.asseterp.biz.rpt.service.RptDailyService;
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
}
