package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.RelateApprApprIdReq;
import kr.co.kfs.asseterp.biz.emp.dto.RelateApprCloseReq;
import kr.co.kfs.asseterp.biz.emp.dto.RelateApprRes;
import kr.co.kfs.asseterp.biz.emp.dto.RelateApprStatusRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpRelateApprService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 여비교통비 관리 (AS-IS Emp50_Tab_TransportExpenseMng → server/emp/Emp51_RelateAppr·Emp52_RelateAppr) — 메뉴 #1348 */
@RestController
@RequestMapping("/api/v1/emp/relate-apprs")
@RequiredArgsConstructor
public class EmpRelateApprController {

    private final EmpRelateApprService service;

    /** AS-IS emp.Emp51_RelateAppr.selectByCompanyId (yyyymm = 'yyyy.MM') */
    @GetMapping
    public ApiResponse<List<RelateApprRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyymm) {
        return ApiResponse.ok(service.search(principal, yyyymm));
    }

    /** AS-IS emp.Emp52_RelateAppr.selectByCompanyId → 기준년월의 상신 문서, 없으면 null */
    @GetMapping("/status")
    public ApiResponse<RelateApprStatusRes> getStatus(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyymm) {
        return ApiResponse.ok(service.getStatus(principal, yyyymm));
    }

    /** AS-IS emp.Emp52_RelateAppr.selectApprId */
    @GetMapping("/appr-id")
    public ApiResponse<Long> getApprId(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyymm) {
        return ApiResponse.ok(service.getApprId(principal, yyyymm));
    }

    /** AS-IS emp.Emp52_RelateAppr.insert → relateApprId (2단계 상신에서 쓴다) */
    @PostMapping("/status")
    public ApiResponse<Long> createStatus(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String yyyymm) {
        return ApiResponse.ok(service.createStatus(principal, yyyymm));
    }

    /** AS-IS emp.Emp52_RelateAppr.updateApprId (상신 뒤, 2단계) */
    @PutMapping("/{relateApprId}/appr-id")
    public ApiResponse<Void> updateApprId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long relateApprId, @RequestBody RelateApprApprIdReq req) {
        service.updateApprId(principal, relateApprId, req.apprId());
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp51_RelateAppr.updateCloseYn ([마감]·[취소]) → 바뀐 건수 */
    @PutMapping("/close")
    public ApiResponse<Integer> updateCloseYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody RelateApprCloseReq req) {
        return ApiResponse.ok(service.updateCloseYn(principal, req.yyyymm(), req.closeYn()));
    }
}
