package kr.co.kfs.asseterp.biz.org.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.org.dto.OrgAccountAuthSaveReq;
import kr.co.kfs.asseterp.biz.org.dto.OrgCodeRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgCodeSaveReq;
import kr.co.kfs.asseterp.biz.org.dto.OrgFundAuthRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgFundAuthSaveReq;
import kr.co.kfs.asseterp.biz.org.dto.OrgInfoRes;
import kr.co.kfs.asseterp.biz.org.service.OrgCodeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
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

/** 조직정보 등록 (AS-IS Org01_Tab_OrgCode → server/org/Org01_Code) */
@RestController
@RequestMapping("/api/v1/org/org-codes")
@RequiredArgsConstructor
public class OrgCodeController {

    private final OrgCodeService orgCodeService;

    /** AS-IS org.Org01_Code.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<OrgCodeRes>> searchOrgCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(orgCodeService.searchOrgCodes(principal, baseDate));
    }

    /** AS-IS org.Org01_Code.update (신규 조직) */
    @PostMapping
    public ApiResponse<OrgCodeRes> createOrgCode(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OrgCodeSaveReq req) {
        return ApiResponse.ok(orgCodeService.createOrgCode(principal, req));
    }

    /** AS-IS org.Org01_Code.update (수정) */
    @PutMapping("/{codeId}")
    public ApiResponse<OrgCodeRes> updateOrgCode(@AuthenticationPrincipal UserPrincipal principal,
                                                 @PathVariable Long codeId, @RequestBody OrgCodeSaveReq req) {
        return ApiResponse.ok(orgCodeService.updateOrgCode(principal, codeId, req));
    }

    /** AS-IS org.Org01_Code.delete → 지운 건수 */
    @DeleteMapping("/{codeId}")
    public ApiResponse<Integer> deleteOrgCode(@AuthenticationPrincipal UserPrincipal principal,
                                              @PathVariable Long codeId, @RequestParam Long infoId) {
        return ApiResponse.ok(orgCodeService.deleteOrgCode(principal, codeId, infoId));
    }
    /** AS-IS org.Org01_Code.selectByKorName (P02 조직찾기) */
    @GetMapping("/search")
    public ApiResponse<List<OrgInfoRes>> searchByKorName(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(required = false) String korName,
                                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(orgCodeService.searchByKorName(principal, korName, baseDate));
    }

    /** AS-IS org.Org01_Code.selectByFundCodeId (P02 펀드별 조직 권한 트리) */
    @GetMapping("/fund-auths")
    public ApiResponse<List<OrgFundAuthRes>> searchFundAuthTree(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long fundCodeId) {
        return ApiResponse.ok(orgCodeService.searchFundAuthTree(principal, fundCodeId));
    }

    /** AS-IS org.Org01_Code.updateFundAuth (P02 [저장]) → 저장한 건수 */
    @PutMapping("/fund-auths")
    public ApiResponse<Integer> updateFundAuth(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OrgFundAuthSaveReq req) {
        return ApiResponse.ok(orgCodeService.updateFundAuth(principal, req));
    }

    /** AS-IS org.Org01_Code.selectByAccountId (Q02 일임계좌별 조직 권한 트리) */
    @GetMapping("/account-auths")
    public ApiResponse<List<OrgFundAuthRes>> searchAccountAuthTree(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long accountId) {
        return ApiResponse.ok(orgCodeService.searchAccountAuthTree(principal, accountId));
    }

    /** AS-IS org.Org01_Code.updateAccountAuth (Q02 [저장]) → 저장한 건수 */
    @PutMapping("/account-auths")
    public ApiResponse<Integer> updateAccountAuth(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OrgAccountAuthSaveReq req) {
        return ApiResponse.ok(orgCodeService.updateAccountAuth(principal, req));
    }
}
