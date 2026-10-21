package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportApprRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceReportService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 내부통제 준수보고(준감인) (AS-IS Ics31_Tab_ComplianceReport → server/sys/Sys99_Print·ics/Ics32_RelateAppr) — 메뉴 #1312 */
@RestController
@RequestMapping("/api/v1/ics/compliance-reports")
@RequiredArgsConstructor
public class IcsComplianceReportController {

    private final IcsComplianceReportService service;

    /** AS-IS sys.Sys99_Print.insertComplianceState — stdDate = 기준 분기(월)의 말일 */
    @GetMapping
    public ApiResponse<List<IcsComplianceReportRes>> report(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate stdDate,
                                                            @RequestParam String cycleType) {
        return ApiResponse.ok(service.report(principal, stdDate, cycleType));
    }

    /** AS-IS ics.Ics32_RelateAppr.selectByCompanyId — yyyymm = 'yyyy.MM', 연결이 없으면 null */
    @GetMapping("/appr")
    public ApiResponse<IcsComplianceReportApprRes> appr(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam String yyyymm, @RequestParam String cycleType) {
        return ApiResponse.ok(service.appr(principal, yyyymm, cycleType));
    }
}
