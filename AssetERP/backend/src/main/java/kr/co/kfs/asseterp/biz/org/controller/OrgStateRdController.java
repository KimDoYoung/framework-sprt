package kr.co.kfs.asseterp.biz.org.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.org.dto.OrgStateRdReq;
import kr.co.kfs.asseterp.biz.org.service.OrgStateRdService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 조직기구현황 RD 출력 (AS-IS Org02_Rd_OrgState → sys.Sys99_Print.insertRdOrgState) */
@RestController
@RequestMapping("/api/v1/org/state")
@RequiredArgsConstructor
public class OrgStateRdController {

    private final OrgStateRdService service;

    /** AS-IS sys.Sys99_Print.insertRdOrgState (T17) → rdGroupId */
    @PostMapping("/rd-print")
    public ApiResponse<Long> rdPrint(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OrgStateRdReq req) {
        return ApiResponse.ok(service.printRd(principal, req));
    }
}
