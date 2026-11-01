package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportApprCreateReq;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportApprCreateRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportApprIdReq;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportApprRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportRes;
import kr.co.kfs.asseterp.biz.emp.dto.MyTransportSaveReq;
import kr.co.kfs.asseterp.biz.emp.service.EmpMyTransportService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 여비교통비 신청 (AS-IS Emp50_Tab_TransportExpense, 메뉴 #1349) */
@RestController
@RequestMapping("/api/v1/emp/my-transport-expenses")
@RequiredArgsConstructor
public class EmpMyTransportController {

    private final EmpMyTransportService service;

    /** AS-IS emp.Emp50_TransportExpense.selectByYearMonth */
    @GetMapping
    public ApiResponse<List<MyTransportRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyymm) {
        return ApiResponse.ok(service.search(principal, yyyymm));
    }

    /** AS-IS emp.Emp50_TransportExpense.update / copyUpdate (UpdateDataModel) */
    @PutMapping
    public ApiResponse<List<MyTransportRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<MyTransportSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS emp.Emp50_TransportExpense.delete */
    @DeleteMapping
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> ids) {
        service.delete(principal, ids);
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp51_RelateAppr.selectByPersonId (없으면 data null = 미상신) */
    @GetMapping("/appr")
    public ApiResponse<MyTransportApprRes> getAppr(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyymm) {
        return ApiResponse.ok(service.getAppr(principal, yyyymm));
    }

    /** AS-IS emp.Emp51_RelateAppr.selectApprId */
    @GetMapping("/appr-id")
    public ApiResponse<Long> getApprId(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyymm) {
        return ApiResponse.ok(service.getApprId(principal, yyyymm));
    }

    /** AS-IS emp.Emp51_RelateAppr.selectByCloseYn */
    @GetMapping("/closed")
    public ApiResponse<Boolean> isClosed(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyymm) {
        return ApiResponse.ok(service.isClosed(principal, yyyymm));
    }

    /** AS-IS emp.Emp51_RelateAppr.insert */
    @PostMapping("/appr")
    public ApiResponse<MyTransportApprCreateRes> createAppr(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MyTransportApprCreateReq req) {
        return ApiResponse.ok(service.createAppr(principal, req.yyyymm(), req.regAmt()));
    }

    /** AS-IS emp.Emp51_RelateAppr.updateApprId */
    @PutMapping("/appr/{relateApprId}/appr-id")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long relateApprId,
                                          @RequestBody MyTransportApprIdReq req) {
        service.updateApprId(principal, relateApprId, req.apprId());
        return ApiResponse.ok(null);
    }
}
