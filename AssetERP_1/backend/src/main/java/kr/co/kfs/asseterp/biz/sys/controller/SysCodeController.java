package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.CodeRes;
import kr.co.kfs.asseterp.biz.sys.service.SysCodeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 공통코드 콤보 (AS-IS ComboBoxField → sys.Sys09_Code.selectByCodeKind) */
@RestController
@RequestMapping("/api/v1/sys/codes")
@RequiredArgsConstructor
public class SysCodeController {

    private final SysCodeService sysCodeService;

    @GetMapping
    public ApiResponse<List<CodeRes>> searchCodes(@AuthenticationPrincipal UserPrincipal principal,
                                                  @RequestParam String kindCd) {
        return ApiResponse.ok(sysCodeService.searchCodes(principal, kindCd));
    }
}
