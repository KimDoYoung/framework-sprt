package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprStepGroupRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprStepGroupService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 결재선 지정그룹 (AS-IS Apr30_Lookup_ApprStepGroup → server/apr/Apr30_ApprStepGroup) */
@RestController
@RequestMapping("/api/v1/apr/appr-step-groups")
@RequiredArgsConstructor
public class AprApprStepGroupController {

    private final AprApprStepGroupService service;

    /** AS-IS apr.Apr30_ApprStepGroup.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<AprApprStepGroupRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }
}
