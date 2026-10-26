package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.OrgAuthBulkReq;
import kr.co.kfs.asseterp.biz.fnd.service.FndOrgAuthService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 펀드별 조직 권한 (AS-IS server/fnd/Fnd08_OrgAuth) */
@RestController
@RequestMapping("/api/v1/fnd/org-auths")
@RequiredArgsConstructor
public class FndOrgAuthController {

    private final FndOrgAuthService service;

    /** AS-IS fnd.Fnd08_OrgAuth.updateAuthYn (P06 일괄 권한설정 [권한부여]·[권한삭제]) → 처리 건수 */
    @PutMapping
    public ApiResponse<Integer> updateAuthYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OrgAuthBulkReq req) {
        return ApiResponse.ok(service.updateAuthYn(principal, req));
    }
}
