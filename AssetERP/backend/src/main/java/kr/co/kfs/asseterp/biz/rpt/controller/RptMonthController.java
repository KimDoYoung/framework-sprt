package kr.co.kfs.asseterp.biz.rpt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.rpt.dto.MonthPrintReq;
import kr.co.kfs.asseterp.biz.rpt.dto.MonthRes;
import kr.co.kfs.asseterp.biz.rpt.dto.MonthSaveReq;
import kr.co.kfs.asseterp.biz.rpt.service.RptMonthService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 월간회의자료 (AS-IS server/rpt/Rpt02_Month, Z10 Rpt02_Tab_MonthWrite) */
@RestController
@RequestMapping("/api/v1/rpt/months")
@RequiredArgsConstructor
public class RptMonthController {

    private final RptMonthService service;

    /** AS-IS rpt.Rpt02_Month.selectByText — yyyyMm = "yyyy.MM" 또는 "yyyy.%"(전체 월), orgCodeId 없으면 전체 본부 */
    @GetMapping
    public ApiResponse<List<MonthRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestParam String yyyyMm,
                                              @RequestParam(required = false) Long orgCodeId,
                                              @RequestParam(required = false, defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchByText(principal, yyyyMm, orgCodeId, searchText));
    }

    /** AS-IS rpt.Rpt02_Month.modelUpdate — 저장한 행 */
    @PutMapping
    public ApiResponse<MonthRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MonthSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS rpt.Rpt02_Month.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS sys.Sys99_Print.insertRdMonth → 출력 그룹 ID (RD 리포트 rdGroupId) */
    @PostMapping("/rd-print")
    public ApiResponse<String> rdPrint(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MonthPrintReq req) {
        return ApiResponse.ok(service.insertRdMonth(principal, req));
    }
}
