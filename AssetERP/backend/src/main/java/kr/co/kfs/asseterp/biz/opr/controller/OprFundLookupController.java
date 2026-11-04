package kr.co.kfs.asseterp.biz.opr.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.opr.dto.OprCreateRes;
import kr.co.kfs.asseterp.biz.opr.dto.OprFundRes;
import kr.co.kfs.asseterp.biz.opr.service.OprFundLookupService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 펀드찾기 창 (AS-IS Opr02_Lookup_Fund) — 운용계획서 목록과 그 연관펀드 */
@RestController
@RequestMapping("/api/v1/opr/creates")
@RequiredArgsConstructor
public class OprFundLookupController {

    private final OprFundLookupService service;

    /** AS-IS opr.Opr01_Create.selectByLookupTitle */
    @GetMapping
    public ApiResponse<List<OprCreateRes>> searchCreates(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(required = false) String title,
                                                         @RequestParam(required = false) String year) {
        return ApiResponse.ok(service.searchCreates(principal, title, year));
    }

    /** AS-IS opr.Opr02_Fund.selectByCreateId */
    @GetMapping("/{createId}/funds")
    public ApiResponse<List<OprFundRes>> searchFunds(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long createId) {
        return ApiResponse.ok(service.searchFunds(principal, createId));
    }
}
