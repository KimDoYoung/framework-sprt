package kr.co.kfs.asseterp.oms.biz.org.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeRes;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgCodeSaveReq;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgHistoryRes;
import kr.co.kfs.asseterp.oms.biz.org.service.OrgCodeService;
import kr.co.kfs.asseterp.oms.biz.org.service.OrgHistoryService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 조직정보 등록 (AS-IS Org01_Tab_OrgCode → org.Org01_Code, org.Org02_Info). 로그인 회사 조직만 */
@RestController
@RequestMapping("/api/v1/org/codes")
@RequiredArgsConstructor
public class OrgCodeController {

    private final OrgCodeService orgCodeService;
    private final OrgHistoryService orgHistoryService;

    @GetMapping
    public ApiResponse<List<OrgCodeRes>> searchOrgCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(orgCodeService.searchOrgCodes(principal, baseDate));
    }

    @PostMapping
    public ApiResponse<OrgCodeRes> createOrgCode(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OrgCodeSaveReq req) {
        return ApiResponse.ok(orgCodeService.createOrgCode(principal, req));
    }

    @PutMapping("/{codeId}")
    public ApiResponse<OrgCodeRes> updateOrgCode(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long codeId,
                                                 @RequestBody OrgCodeSaveReq req) {
        return ApiResponse.ok(orgCodeService.updateOrgCode(principal, codeId, req));
    }

    /** 조직 이력 */
    @GetMapping("/{codeId}/histories")
    public ApiResponse<List<OrgHistoryRes>> searchHistories(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long codeId) {
        return ApiResponse.ok(orgHistoryService.searchHistories(principal, codeId));
    }

    /** 이력 한 건 삭제 (최초 이력이 아닌 것) */
    @DeleteMapping("/{codeId}/histories/{infoId}")
    public ApiResponse<Void> deleteHistory(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long codeId,
                                           @PathVariable Long infoId) {
        orgHistoryService.deleteHistory(principal, codeId, infoId);
        return ApiResponse.ok(null);
    }

    /** 조직 삭제 (하위 조직·발령 사원이 없을 때) */
    @DeleteMapping("/{codeId}")
    public ApiResponse<Void> deleteOrg(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long codeId) {
        orgHistoryService.deleteOrg(principal, codeId);
        return ApiResponse.ok(null);
    }
}
