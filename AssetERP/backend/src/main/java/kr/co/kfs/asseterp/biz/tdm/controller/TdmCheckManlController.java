package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckBatchCompleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckCheckerReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckCompleteReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlDetailRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlIdsReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlRes;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlSaveReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckStatusReq;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckManlService;
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

/** 이행점검 항목 — 점검자 지정 (AS-IS Tdm51_TabPage_CheckOrg, N21)·이행점검 처리 (Tdm52_Tab_CheckManl, N22) → server/tdm/Tdm52_ChckManl */
@RestController
@RequestMapping("/api/v1/tdm/check-manls")
@RequiredArgsConstructor
public class TdmCheckManlController {

    private final TdmCheckManlService service;

    /** AS-IS tdm.Tdm52_ChckManl.selectByChckOrgId */
    @GetMapping
    public ApiResponse<List<CheckManlRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam Long chckOrgId,
                                                  @RequestParam(defaultValue = "false") boolean unspecYn,
                                                  @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, chckOrgId, unspecYn, searchText));
    }

    /** AS-IS tdm.Tdm52_ChckManl.updateCheckerId */
    @PutMapping("/checker")
    public ApiResponse<Void> updateChecker(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CheckCheckerReq req) {
        service.updateChecker(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm52_ChckManl.selectById — N21 점검항목 목록의 [상세] 아이콘이 점검 창(view)을 여는 데 쓴다 */
    @GetMapping("/{chckManlId}")
    public ApiResponse<CheckManlDetailRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckManlId) {
        return ApiResponse.ok(service.requireManl(principal, chckManlId));
    }

    /** AS-IS tdm.Tdm52_ChckManl.selectByPersonId — 점검자의 점검항목 */
    @GetMapping("/by-person")
    public ApiResponse<List<CheckManlDetailRes>> searchByPerson(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestParam Long chckOrgId, @RequestParam Long personId,
                                                                @RequestParam(defaultValue = "false") boolean undoneYn,
                                                                @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchByPerson(principal, chckOrgId, personId, undoneYn, searchText));
    }

    /** AS-IS tdm.Tdm52_ChckManl.updateCheckStatus — 점검시작(P)·시작취소(C) */
    @PutMapping("/check-status")
    public ApiResponse<Void> updateCheckStatus(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CheckStatusReq req) {
        service.updateCheckStatus(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm52_ChckManl.modelUpdate */
    @PutMapping("/{chckManlId}")
    public ApiResponse<CheckManlDetailRes> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckManlId,
                                                  @RequestBody CheckManlSaveReq req) {
        return ApiResponse.ok(service.update(principal, chckManlId, req));
    }

    /** AS-IS tdm.Tdm52_ChckManl.updateComplete — 점검완료(P)·완료취소(C) */
    @PutMapping("/{chckManlId}/complete")
    public ApiResponse<CheckManlDetailRes> updateComplete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long chckManlId,
                                                          @RequestBody CheckCompleteReq req) {
        return ApiResponse.ok(service.updateComplete(principal, chckManlId, req));
    }

    /** AS-IS tdm.Tdm52_ChckManl.batchCheckComplete */
    @PostMapping("/batch-complete")
    public ApiResponse<Void> batchComplete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CheckBatchCompleteReq req) {
        service.batchComplete(principal, req);
        return ApiResponse.ok(null);
    }

    /** AS-IS tdm.Tdm52_ChckManl.batchCancelComplete */
    @PostMapping("/batch-cancel")
    public ApiResponse<Void> batchCancel(@AuthenticationPrincipal UserPrincipal principal, @RequestBody CheckManlIdsReq req) {
        service.batchCancel(principal, req.chckManlIds());
        return ApiResponse.ok(null);
    }
}
