package kr.co.kfs.asseterp.biz.apr.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprApprIdRowRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprIdListService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;

/** 결재문서 번호 목록으로 문서 읽기 — Apr01_Lookup_ApprLink (V34, 이행점검 보고서처럼 문서가 둘 이상일 때 고르는 창) */
@RestController
@RequestMapping("/api/v1/apr/apprs")
@RequiredArgsConstructor
public class AprApprIdListController {

    private final AprApprIdListService service;

    /** AS-IS apr.Apr01_Appr.selectByApprIdList. 번호가 없으면 빈 목록 */
    @GetMapping("/by-ids")
    public ApiResponse<List<AprApprIdRowRes>> byIds(@AuthenticationPrincipal UserPrincipal principal, @RequestParam List<Long> apprIds) {
        return ApiResponse.ok(service.byIds(principal, apprIds));
    }
}
