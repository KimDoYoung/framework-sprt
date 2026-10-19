package kr.co.kfs.asseterp.biz.fnd.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.FundCodeRes;
import kr.co.kfs.asseterp.biz.fnd.service.FndFundCodeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 펀드코드 (AS-IS server/fnd/Fnd01_FundCode) */
@RestController
@RequestMapping("/api/v1/fnd/fund-codes")
@RequiredArgsConstructor
public class FndFundCodeController {

    private final FndFundCodeService service;

    /** AS-IS fnd.Fnd01_FundCode.selectByFundOrgAuth (Apr01_Tab_FundDocument, F06 펀드별 문서검색) */
    @GetMapping("/org-auth")
    public ApiResponse<List<FundCodeRes>> searchByOrgAuth(@AuthenticationPrincipal UserPrincipal principal,
                                                          @RequestParam(defaultValue = "false") boolean closeYn,
                                                          @RequestParam(defaultValue = "true") boolean classFundExceptYn,
                                                          @RequestParam(defaultValue = "") String fundName,
                                                          @RequestParam(required = false) String fundTypeCode,
                                                          @RequestParam(required = false) String classTypeCode) {
        return ApiResponse.ok(service.searchByOrgAuth(principal, closeYn, classFundExceptYn, fundName, fundTypeCode, classTypeCode));
    }
}
