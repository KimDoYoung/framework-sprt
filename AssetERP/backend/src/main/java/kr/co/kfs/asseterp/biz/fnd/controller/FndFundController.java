package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundLookupRes;
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
}
