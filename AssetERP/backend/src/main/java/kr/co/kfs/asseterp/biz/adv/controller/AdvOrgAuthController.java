package kr.co.kfs.asseterp.biz.adv.controller;

import kr.co.kfs.asseterp.biz.adv.dto.AccountRes;
import kr.co.kfs.asseterp.biz.adv.dto.OrgAuthBulkReq;
import kr.co.kfs.asseterp.biz.adv.service.AdvOrgAuthService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 일임계좌별 조직 권한 (AS-IS server/adv/Adv05_OrgAuth) */
@RestController
@RequestMapping("/api/v1/adv/org-auths")
@RequiredArgsConstructor
public class AdvOrgAuthController {

    private final AdvOrgAuthService service;

    /** AS-IS adv.Adv02_Account.selectByOrgAuthPaging (Q02 일임계좌 조회창 Adv02_Lookup_SelectMulti) — 페이지 행 + 전체 건수 */
    @GetMapping("/accounts")
    public ApiResponse<PageRes<AccountRes>> searchAccounts(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam(defaultValue = "") String searchText,
                                                           @RequestParam(defaultValue = "0") int offset,
                                                           @RequestParam(defaultValue = "500") int limit) {
        return ApiResponse.ok(service.searchByOrgAuth(principal, searchText, offset, limit));
    }

    /** AS-IS adv.Adv05_OrgAuth.updateAuthYn (Q02 일괄 권한설정 [권한부여]·[권한삭제]) → 처리 건수 */
    @PutMapping
    public ApiResponse<Integer> updateAuthYn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OrgAuthBulkReq req) {
        return ApiResponse.ok(service.updateAuthYn(principal, req));
    }
}
