package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStepIdsReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStepRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckApprStepRow;
import kr.co.kfs.asseterp.biz.tdm.service.TdmChckApprStepService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 부서 점검 승인선 (AS-IS Tdm58_Lookup_ChckApprStep, N21) → server/tdm/Tdm58_ChckApprStep */
@RestController
@RequestMapping("/api/v1/tdm/chck-appr-steps")
@RequiredArgsConstructor
public class TdmChckApprStepController {

    private final TdmChckApprStepService service;

    /** AS-IS tdm.Tdm58_ChckApprStep.selectByChckOrgId */
    @GetMapping
    public ApiResponse<List<CheckApprStepRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long chckOrgId) {
        return ApiResponse.ok(service.search(principal, chckOrgId));
    }

    /** AS-IS tdm.Tdm58_ChckApprStep.update */
    @PutMapping
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<CheckApprStepRow> rows) {
        service.save(principal, rows);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm58_ChckApprStep.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CheckApprStepIdsReq req) {
        return ApiResponse.ok(service.delete(principal, req.chckApprStepIds()));
    }
}
