package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckFixReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckOrgStatusRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckOrgService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 업무점검자 지정 및 승인요청 (AS-IS Tdm51_Tab_CheckOrg, N21) → server/tdm/Tdm51_ChckOrg */
@RestController
@RequestMapping("/api/v1/tdm/check-orgs")
@RequiredArgsConstructor
public class TdmCheckOrgController {

    private final TdmCheckOrgService service;

    /** AS-IS tdm.Tdm51_ChckOrg.selectByOrgId */
    @GetMapping
    public ApiResponse<List<CheckOrgStatusRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam String checkYm, @RequestParam Long orgId) {
        return ApiResponse.ok(service.search(principal, checkYm, orgId));
    }

    /** AS-IS tdm.Tdm51_ChckOrg.updateFix — 확정(P)·확정취소(C) */
    @PutMapping("/{chckOrgId}/fix")
    public ApiResponse<Void> updateFix(@AuthenticationPrincipal UserPrincipal principal,
                                       @PathVariable Long chckOrgId, @RequestBody CheckFixReq req) {
        service.updateFix(principal, chckOrgId, req.actionType());
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm51_ChckOrg.updateApprStatus — 승인요청(P)·요청취소(C) */
    @PutMapping("/{chckOrgId}/appr-status")
    public ApiResponse<Void> updateApprStatus(@AuthenticationPrincipal UserPrincipal principal,
                                              @PathVariable Long chckOrgId, @RequestBody CheckFixReq req) {
        service.updateApprStatus(principal, chckOrgId, req.actionType());
        return ApiResponse.ok(null);
    }
}
