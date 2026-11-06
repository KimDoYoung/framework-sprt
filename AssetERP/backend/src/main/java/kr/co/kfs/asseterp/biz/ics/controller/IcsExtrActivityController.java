package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsExtrActivityApprIdReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsExtrActivityRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsExtrActivitySaveReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsExtrActivityService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 대외활동 (AS-IS Ics35_Tab_ExtrActivity·Ics35_Tab_ExtrActivityList → server/ics/Ics35_ExtrActivity) — 신청 #1431(M01), 신청내역 #1432(M02) */
@RestController
@RequestMapping("/api/v1/ics/extr-activities")
@RequiredArgsConstructor
public class IcsExtrActivityController {

    private final IcsExtrActivityService service;

    /** AS-IS ics.Ics35_ExtrActivity.selectByPersonId (로그인 사원 본인) */
    @GetMapping
    public ApiResponse<List<IcsExtrActivityRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate));
    }

    /** AS-IS ics.Ics35_ExtrActivity.selectByCompanyId (M02 신청내역 — 회사 전체) */
    @GetMapping("/company")
    public ApiResponse<List<IcsExtrActivityRes>> searchForCompany(@AuthenticationPrincipal UserPrincipal principal,
                                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                                  @RequestParam(defaultValue = "false") boolean unknown) {
        return ApiResponse.ok(service.searchForCompany(principal, startDate, closeDate, unknown));
    }

    /** 새 신청의 id (AS-IS Ics35_Edit_ExtrActivity.insert의 DBUtil.setSeq) */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS ics.Ics35_ExtrActivity.modelUpdate → 저장된 행 */
    @PutMapping
    public ApiResponse<IcsExtrActivityRes> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcsExtrActivitySaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS ics.Ics35_ExtrActivity.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> extrActivityIds) {
        return ApiResponse.ok(service.delete(principal, extrActivityIds));
    }

    /** AS-IS ics.Ics35_ExtrActivity.updateApprId (B15 활동신청 결재문서 ID 기록) */
    @PutMapping("/{extrActivityId}/appr-id")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long extrActivityId,
                                          @RequestBody IcsExtrActivityApprIdReq req) {
        service.updateApprId(principal, extrActivityId, req.apprId());
        return ApiResponse.ok(null);
    }

    /** AS-IS ics.Ics35_ExtrActivity.updateResultApprId (B16 결과보고 결재문서 ID 기록) */
    @PutMapping("/{extrActivityId}/result-appr-id")
    public ApiResponse<Void> updateResultApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long extrActivityId,
                                                @RequestBody IcsExtrActivityApprIdReq req) {
        service.updateResultApprId(principal, extrActivityId, req.apprId());
        return ApiResponse.ok(null);
    }
}
