package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckCheckerReq;
import kr.co.kfs.asseterp.biz.tdm.dto.CheckManlRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmCheckManlService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 이행점검 항목 — 점검자 지정 (AS-IS Tdm51_TabPage_CheckOrg, N21) → server/tdm/Tdm52_ChckManl */
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
}
