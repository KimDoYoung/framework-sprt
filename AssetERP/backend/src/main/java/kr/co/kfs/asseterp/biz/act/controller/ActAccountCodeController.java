package kr.co.kfs.asseterp.biz.act.controller;

import kr.co.kfs.asseterp.biz.act.dto.AccountCodeRes;
import kr.co.kfs.asseterp.biz.act.service.ActAccountCodeService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 계정코드 (AS-IS Act01_Lookup_AccountCode → server/act/Act01_AccountCode) — 다른 도메인에서 쓰는 조회창 */
@RestController
@RequestMapping("/api/v1/act/account-codes")
@RequiredArgsConstructor
public class ActAccountCodeController {

    private final ActAccountCodeService service;

    /** AS-IS act.Act01_AccountCode.selectBySlipYn (전표생성 계정, companyId 없으면 로그인 회사) */
    @GetMapping("/lookup")
    public ApiResponse<List<AccountCodeRes>> lookup(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestParam(required = false) Long companyId,
                                                    @RequestParam(required = false) String attributeCode,
                                                    @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.searchBySlipYn(principal, companyId, attributeCode, searchText));
    }
}
