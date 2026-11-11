package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportApprRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportApprIdReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportRelateReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceReportRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceRdStateReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceRdPdfService;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceReportService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

/** 내부통제 준수보고(준감인) (AS-IS Ics31_Tab_ComplianceReport → server/sys/Sys99_Print·ics/Ics32_RelateAppr) — 메뉴 #1312 */
@RestController
@RequestMapping("/api/v1/ics/compliance-reports")
@RequiredArgsConstructor
public class IcsComplianceReportController {

    private final IcsComplianceReportService service;
    private final IcsComplianceRdPdfService rdPdfService;

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
                                                        @RequestParam String yyyymm, @RequestParam String cycleType,
                                                        @RequestParam(required = false) String apprType) {
        return ApiResponse.ok(service.appr(principal, yyyymm, cycleType, apprType));
    }

    /** AS-IS ics.Ics32_RelateAppr.insert — 상신 연결 ID를 만들거나 있으면 돌려준다 (V19, A32) */
    @PostMapping("/relate-apprs")
    public ApiResponse<Long> createRelateAppr(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsComplianceReportRelateReq req) {
        return ApiResponse.ok(service.createRelateAppr(principal, req.yyyymm(), req.cycleType(), req.apprType()));
    }

    /** #1311 [상신] — AS-IS sys.Sys99_Print.insertComplianceState(confirmerId = 로그인 사원) → 출력 그룹 ID (RD 첨부 PDF 자료) */
    @PostMapping("/rd-state")
    public ApiResponse<Long> insertComplianceState(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsComplianceRdStateReq req) {
        return ApiResponse.ok(rdPdfService.insertComplianceState(principal, req.stdDate(), req.cycleType()));
    }

    /**
     * AS-IS ics.Ics32_RelateAppr.updateApprId. rdGroupId가 오면(#1311) 결재 저장 때 붙이던 RD 첨부 PDF도 붙인다
     * (AS-IS Apr01_Grid_ApprFile.ics32RelateApprFileSetting). PDF가 안 만들어져도 상신 기록은 그대로 둔다
     */
    @PutMapping("/relate-apprs/{relateApprId}/appr-id")
    public ApiResponse<Void> updateRelateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long relateApprId,
                                                @RequestBody IcsComplianceReportApprIdReq req) {
        service.updateRelateApprId(principal, relateApprId, req.apprId());
        if (req.rdGroupId() != null) {
            rdPdfService.attach(principal, req.rdGroupId(), req.apprId(), req.yyyy(), req.cycleName());
        }
        return ApiResponse.ok(null);
    }
}
