package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrStampAuthSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrStampAuthTreeRes;
import kr.co.kfs.asseterp.biz.dcr.service.DcrStampAuthService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 인감별 미사용 문서분류 (AS-IS Dcr40_Lookup_StampAuth → server/dcr/Dcr40_StampAuth) */
@RestController
@RequestMapping("/api/v1/dcr/stamp-auths")
@RequiredArgsConstructor
public class DcrStampAuthController {

    private final DcrStampAuthService service;

    /** AS-IS dcr.Dcr01_ClassTree.selectByAllWithStampAuth */
    @GetMapping("/{stampId}")
    public ApiResponse<List<DcrStampAuthTreeRes>> searchTree(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long stampId) {
        return ApiResponse.ok(service.searchTree(principal, stampId));
    }

    /** AS-IS dcr.Dcr40_StampAuth.updateList */
    @PutMapping("/{stampId}")
    public ApiResponse<Void> save(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long stampId, @RequestBody List<DcrStampAuthSaveReq> rows) {
        service.save(principal, stampId, rows);
        return ApiResponse.ok(null);
    }
}
