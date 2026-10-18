package kr.co.kfs.asseterp.biz.tdm.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgRes;
import kr.co.kfs.asseterp.biz.tdm.service.TdmManlOrgService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 책무매뉴얼 재생성 (AS-IS Tdm42_Tab_ManlManagerAdmin → server/tdm/Tdm42_ManlOrg) */
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
}
