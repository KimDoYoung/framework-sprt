package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.SecondaryAuthVerifyReq;
import kr.co.kfs.asseterp.biz.sys.service.SysSecondaryAuthService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 2차 인증 창 (AS-IS Sys83_Lookup_TempPassword, EE64) */
@RestController
@RequestMapping("/api/v1/sys/secondary-auths")
@RequiredArgsConstructor
public class SysSecondaryAuthController {

    private final SysSecondaryAuthService service;

    /** 로그인 직후 2차 인증이 필요한가 (회사 설정 + 회사관리자 아님) */
    @GetMapping("/required")
    public ApiResponse<Boolean> isRequired(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.isRequired(principal));
    }

    /** AS-IS sys.Sys83_SecondaryAuthUser.sendTempPassword */
    @PostMapping("/code")
    public ApiResponse<Void> send(@AuthenticationPrincipal UserPrincipal principal) {
        service.send(principal);
        return ApiResponse.ok("인증번호가 발송되었습니다", null);
    }

    /** AS-IS sys.Sys83_SecondaryAuthUser.selectByTempPassword → 맞으면 true */
    @PostMapping("/verify")
    public ApiResponse<Boolean> verify(@AuthenticationPrincipal UserPrincipal principal, @RequestBody SecondaryAuthVerifyReq req) {
        return ApiResponse.ok(service.verify(principal, req.code()));
    }
}
