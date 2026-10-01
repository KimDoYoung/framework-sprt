package kr.co.kfs.asseterp.oms.biz.org.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.org.dto.OrgInfoRes;
import kr.co.kfs.asseterp.oms.biz.org.service.OrgInfoService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/** 조직정보 (AS-IS org.Org00_OrgInfo) — 조직 Lookup */
@RestController
@RequestMapping("/api/v1/org/org-infos")
@RequiredArgsConstructor
public class OrgInfoController {

    private final OrgInfoService orgInfoService;

    @GetMapping
    public ApiResponse<List<OrgInfoRes>> searchOrgInfos(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String korNm,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate baseDate) {
        return ApiResponse.ok(orgInfoService.searchOrgInfos(principal, korNm, baseDate));
    }
}
