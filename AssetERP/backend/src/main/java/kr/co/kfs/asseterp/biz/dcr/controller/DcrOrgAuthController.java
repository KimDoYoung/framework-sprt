package kr.co.kfs.asseterp.biz.dcr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthByClassSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthByOrgSaveReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthClassRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthCopyReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthOrgRes;
import kr.co.kfs.asseterp.biz.dcr.service.DcrOrgAuthService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 문서권한관리 (EE06 문서분류별 조직 맵핑 · EE07 조직별 문서분류 맵핑 → dcr03_org_auth) */
@RestController
@RequestMapping("/api/v1/dcr/org-auths")
@RequiredArgsConstructor
public class DcrOrgAuthController {

    private final DcrOrgAuthService service;

    /** AS-IS sys.Sys01_Company.selectById 중 dcrDetailUseYn (안내 문구) */
    @GetMapping("/detail-use")
    public ApiResponse<Boolean> getDetailUse(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.getDetailUse(principal));
    }

    /** AS-IS org.Org01_Code.selectByDcrCodeId (EE06) */
    @GetMapping("/by-class-tree")
    public ApiResponse<List<DcrOrgAuthOrgRes>> searchOrgsByClassTree(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId) {
        return ApiResponse.ok(service.searchOrgsByClassTree(principal, classTreeId));
    }

    /** AS-IS org.Org01_Code.updateDcrAuth (EE06 [저장]) → 저장한 조직 행 수 */
    @PutMapping("/by-class-tree")
    public ApiResponse<Integer> updateByClassTree(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrOrgAuthByClassSaveReq req) {
        return ApiResponse.ok(service.updateByClassTree(principal, req));
    }

    /** AS-IS dcr.Dcr03_OrgAuth.selectByOrgCodeId (EE07) */
    @GetMapping("/by-org")
    public ApiResponse<List<DcrOrgAuthClassRes>> searchClassTreesByOrg(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long orgCodeId) {
        return ApiResponse.ok(service.searchClassTreesByOrg(principal, orgCodeId));
    }

    /** AS-IS dcr.Dcr03_OrgAuth.update (EE07 [저장]) → 저장한 행 수 */
    @PutMapping("/by-org")
    public ApiResponse<Integer> updateByOrg(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrOrgAuthByOrgSaveReq req) {
        return ApiResponse.ok(service.updateByOrg(principal, req));
    }

    /** AS-IS org.Org01_Code.copyDcrRight (EE07 [권한복사]) → 복사한 도착 조직 수 */
    @PostMapping("/copy")
    public ApiResponse<Integer> copy(@AuthenticationPrincipal UserPrincipal principal, @RequestBody DcrOrgAuthCopyReq req) {
        return ApiResponse.ok(service.copy(principal, req));
    }
}
