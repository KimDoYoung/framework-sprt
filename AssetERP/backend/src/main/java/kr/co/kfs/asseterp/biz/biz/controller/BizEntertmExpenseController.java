package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizEntertmCompanyRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizEntertmHistoryRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizEntertmMonthRes;
import kr.co.kfs.asseterp.biz.biz.service.BizEntertmExpenseService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 접대비 현황 (AS-IS Biz01_Tab_EntertmExpenseReport — 탭 3개의 조회) */
@RestController
@RequestMapping("/api/v1/biz/entertm-expenses")
@RequiredArgsConstructor
public class BizEntertmExpenseController {

    private final BizEntertmExpenseService service;

    /** 월별 제공금액 누계 — month '01'~'12' 또는 '전체' */
    @GetMapping("/monthly")
    public ApiResponse<List<BizEntertmMonthRes>> monthly(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String year,
                                                         @RequestParam String month, @RequestParam(required = false) String cardRealUserType) {
        return ApiResponse.ok(service.searchMonthly(principal, year, month, cardRealUserType));
    }

    /** 제공 내역 */
    @GetMapping("/history")
    public ApiResponse<List<BizEntertmHistoryRes>> history(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String year,
                                                           @RequestParam String month, @RequestParam(required = false) String cardRealUserType) {
        return ApiResponse.ok(service.searchHistory(principal, year, month, cardRealUserType));
    }

    /** 거래처별 제공금액 (왼쪽 목록) */
    @GetMapping("/companies")
    public ApiResponse<List<BizEntertmCompanyRes>> companies(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String year,
                                                             @RequestParam String month) {
        return ApiResponse.ok(service.searchCompanies(principal, year, month));
    }

    /** 고른 거래처의 제공 내역 (오른쪽 목록) — 미지정거래처는 이름 그대로 */
    @GetMapping("/company-history")
    public ApiResponse<List<BizEntertmHistoryRes>> companyHistory(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String year,
                                                                  @RequestParam String month, @RequestParam(required = false) String cardRealUserType,
                                                                  @RequestParam String targetCompanyName) {
        return ApiResponse.ok(service.searchByTargetCompany(principal, year, month, cardRealUserType, targetCompanyName));
    }
}
