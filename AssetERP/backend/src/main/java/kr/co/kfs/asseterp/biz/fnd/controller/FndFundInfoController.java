package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundInfoRes;
import kr.co.kfs.asseterp.biz.fnd.service.FndFundInfoService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 펀드 변경이력 (AS-IS server/fnd/Fnd02_FundInfo) */
@RestController
@RequestMapping("/api/v1/fnd/fund-infos")
@RequiredArgsConstructor
public class FndFundInfoController {

    private final FndFundInfoService service;

    /** AS-IS fnd.Fnd02_FundInfo.selectByPaging (Fnd01_Grid_FundIcamHistory) */
    @GetMapping
    public ApiResponse<PageRes<FundInfoRes>> searchPaging(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam String fundCode,
                                                          @RequestParam long offset,
                                                          @RequestParam long limit) {
        return ApiResponse.ok(service.searchPaging(principal, fundCode, offset, limit));
    }
}
