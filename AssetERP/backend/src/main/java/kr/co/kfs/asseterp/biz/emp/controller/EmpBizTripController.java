package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.BizTripApprIdReq;
import kr.co.kfs.asseterp.biz.emp.dto.BizTripRes;
import kr.co.kfs.asseterp.biz.emp.dto.BizTripShareReq;
import kr.co.kfs.asseterp.biz.emp.dto.MyBizTripRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyBizTripSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.BizTripSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpBizTripService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 출장관리 (AS-IS Emp53_Tab_BizTripManager) */
@RestController
@RequestMapping("/api/v1/emp/biz-trips")
@RequiredArgsConstructor
public class EmpBizTripController {

    private final EmpBizTripService service;

    /** AS-IS emp.Emp53_BizTrip.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<BizTripRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                @RequestParam(defaultValue = "true") boolean resultSkipYn,
                                                @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.search(principal, startDate, closeDate, resultSkipYn, searchText));
    }

    /** AS-IS emp.Emp53_BizTrip.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<BizTripRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BizTripSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    // ===== Y05 출장품의 및 결과보고 (Emp53_Tab_BizTrip, 메뉴 #1359) =====

    /** AS-IS emp.Emp53_BizTrip.selectByPersonId (본인 출장) */
    @GetMapping("/mine")
    public ApiResponse<List<MyBizTripRes>> searchMine(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate closeDate,
                                                      @RequestParam(defaultValue = "") String searchText) {
        return ApiResponse.ok(service.searchMine(principal, startDate, closeDate, searchText));
    }

    /** AS-IS emp.Emp53_BizTrip.modelUpdate (새 출장) */
    @PostMapping
    public ApiResponse<MyBizTripRes> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MyBizTripSaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS emp.Emp53_BizTrip.modelUpdate (고침) */
    @PutMapping("/{bizTripId}")
    public ApiResponse<MyBizTripRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long bizTripId,
                                            @RequestBody MyBizTripSaveReq req) {
        return ApiResponse.ok(service.update(principal, bizTripId, req));
    }

    /** AS-IS emp.Emp53_BizTrip.update (결재문서 ID) */
    @PutMapping("/{bizTripId}/appr-id")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long bizTripId,
                                          @RequestBody BizTripApprIdReq req) {
        service.updateApprId(principal, bizTripId, req.apprId(), req.result());
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp53_BizTrip.updateShareInfo */
    @PutMapping("/{bizTripId}/share")
    public ApiResponse<MyBizTripRes> updateShare(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long bizTripId,
                                                 @RequestBody BizTripShareReq req) {
        return ApiResponse.ok(service.updateShare(principal, bizTripId, req.publicYn()));
    }

    /** AS-IS emp.Emp53_BizTrip.delete */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> ids) {
        service.delete(principal, ids);
        return ApiResponse.ok(null);
    }
}
