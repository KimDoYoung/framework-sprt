package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgApprRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgIdsReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgLockReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgPeriodReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgPeriodRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmManlOrgService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 책무매뉴얼 재생성(AS-IS Tdm42_Tab_ManlManagerAdmin, E13)·부서별 매뉴얼 보고(Tdm42_Tab_ManlOrgAppr, N18) → server/tdm/Tdm42_ManlOrg */
@RestController
@RequestMapping("/api/v1/tdm/manl-orgs")
@RequiredArgsConstructor
public class TdmManlOrgController {

    private final TdmManlOrgService service;

    /** AS-IS tdm.Tdm42_ManlOrg.selectByText */
    @GetMapping
    public ApiResponse<List<ManlOrgRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestParam(required = false) Long companyId,
                                                @RequestParam(required = false) Long orgId,
                                                @RequestParam(required = false) String searchText,
                                                @RequestParam(defaultValue = "true") boolean notPeriodYn,
                                                @RequestParam(required = false) String startDate,
                                                @RequestParam(required = false) String closeDate) {
        return ApiResponse.ok(service.search(principal, companyId, orgId, searchText, notPeriodYn, startDate, closeDate));
    }

    /** 한 건 재생성 (AS-IS createRd 한 건 분량 — 여러 건의 진행 표시는 화면이 건마다 부른다) */
    @PostMapping("/{manlOrgId}/recreate")
    public ApiResponse<Void> recreate(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long manlOrgId) {
        service.recreate(principal, manlOrgId);
        return ApiResponse.ok(null);
    }

    /** N18 AS-IS tdm.Tdm42_ManlOrg.selectByText (로그인 회사·부서) */
    @GetMapping("/appr")
    public ApiResponse<List<ManlOrgApprRes>> searchAppr(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(required = false) String searchText,
                                                        @RequestParam(defaultValue = "false") boolean useYn) {
        return ApiResponse.ok(service.searchAppr(principal, searchText, useYn));
    }

    /** N18 AS-IS tdm.Tdm42_ManlOrg.notManlOrgList (목록 밖의 부서 책무매뉴얼 — 본문이 ID 목록이라 POST) */
    @PostMapping("/appr/not-in")
    public ApiResponse<List<ManlOrgPeriodRes>> notIn(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ManlOrgIdsReq req) {
        return ApiResponse.ok(service.notIn(principal, req.manlOrgIds()));
    }

    /** N18 AS-IS tdm.Tdm42_ManlOrg.update — 적용시작일·적용종료일 */
    @PutMapping("/appr/periods")
    public ApiResponse<Void> savePeriods(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<ManlOrgPeriodReq> rows) {
        service.savePeriods(principal, rows);
        return ApiResponse.ok(null);
    }

    /** N18 AS-IS tdm.Tdm42_ManlOrg.updateLock — 'P' 잠금 / 'C' 잠금해제 */
    @PutMapping("/appr/lock")
    public ApiResponse<Void> updateLock(@AuthenticationPrincipal UserPrincipal principal, @RequestBody ManlOrgLockReq req) {
        service.updateLock(principal, req.actionType(), req.manlOrgIds());
        return ApiResponse.ok(null);
    }
}
