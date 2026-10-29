package kr.co.kfs.asseterp.biz.att.controller;

import kr.co.kfs.asseterp.biz.att.dto.AttWorkPolicyRes;
import kr.co.kfs.asseterp.biz.att.dto.AttWorkPolicySaveReq;
import kr.co.kfs.asseterp.biz.att.service.AttWorkPolicyService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 근태정책 설정 (AS-IS Att01_Lookup_WorkPolicy ← Att02_Tab_CommuteAdmin [근태정책설정] → server/att/Att01_WorkPolicy) */
@RestController
@RequestMapping("/api/v1/att/work-policies")
@RequiredArgsConstructor
public class AttWorkPolicyController {

    private final AttWorkPolicyService service;

    /** AS-IS att.Att01_WorkPolicy.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<AttWorkPolicyRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS att.Att01_WorkPolicy.getModel (사용 중인 정책) */
    @GetMapping("/active")
    public ApiResponse<List<AttWorkPolicyRes>> active(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.active(principal));
    }

    /** AS-IS att.Att01_WorkPolicy.update */
    @PutMapping
    public ApiResponse<List<AttWorkPolicyRes>> save(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestBody List<AttWorkPolicySaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS att.Att01_WorkPolicy.delete */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
