package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundLookupRes;
import kr.co.kfs.asseterp.biz.fnd.dto.FundMultiRes;
import kr.co.kfs.asseterp.biz.fnd.service.FndFundService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 펀드 (AS-IS server/fnd/Fnd00_Fund) */
@RestController
@RequestMapping("/api/v1/fnd/funds")
@RequiredArgsConstructor
public class FndFundController {

    private final FndFundService service;

    /** AS-IS fnd.Fnd00_Fund.selectByLookupFundCode (P01 펀드찾기) */
    @GetMapping("/lookup")
    public ApiResponse<List<FundLookupRes>> searchLookup(@AuthenticationPrincipal UserPrincipal principal,
                                                         @RequestParam(defaultValue = "false") boolean closeYn,
                                                         @RequestParam(defaultValue = "") String fundName) {
        return ApiResponse.ok(service.searchLookup(principal, closeYn, fundName));
    }

    /** AS-IS fnd.Fnd00_Fund.selectBySearchText → selectBySearchTextAdmin (P06 연관펀드 조회창 Fnd01_Lookup_SelectMulti.openAdmin) */
    @GetMapping("/multi")
    public ApiResponse<List<FundMultiRes>> searchMultiAdmin(@AuthenticationPrincipal UserPrincipal principal,
                                                            @RequestParam(defaultValue = "false") boolean planYn,
                                                            @RequestParam(required = false) String fundType,
                                                            @RequestParam(defaultValue = "") String searchText,
                                                            @RequestParam(defaultValue = "false") boolean closeYn,
                                                            @RequestParam(defaultValue = "true") boolean classYn) {
        return ApiResponse.ok(service.searchMultiAdmin(principal, planYn, fundType, searchText, closeYn, classYn));
    }
}
