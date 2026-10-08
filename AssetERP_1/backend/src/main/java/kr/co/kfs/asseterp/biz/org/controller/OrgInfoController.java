package kr.co.kfs.asseterp.biz.org.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.org.dto.OrgInfoRes;
import kr.co.kfs.asseterp.biz.org.service.OrgInfoService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 조직 조회 (AS-IS Org00_Lookup_SelectSingle → server/org/Org00_OrgInfo) */
@RestController
@RequestMapping("/api/v1/org/org-infos")
@RequiredArgsConstructor
public class OrgInfoController {

    private final OrgInfoService orgInfoService;

    /** AS-IS org.Org00_OrgInfo.selectByKorName */
    @GetMapping
    public ApiResponse<List<OrgInfoRes>> searchOrgInfos(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestParam(required = false) String korName,
                                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(orgInfoService.searchOrgInfos(principal, korName, baseDate));
    }

    /** AS-IS org.Org00_OrgInfo.selectByOrgCodeId */
    @GetMapping("/{orgCodeId}")
    public ApiResponse<OrgInfoRes> getOrgInfo(@AuthenticationPrincipal UserPrincipal principal,
                                              @PathVariable Long orgCodeId,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(orgInfoService.getOrgInfo(principal, orgCodeId, baseDate));
    }
}
