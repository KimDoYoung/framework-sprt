package kr.co.kfs.asseterp.biz.auth.controller;

import kr.co.kfs.asseterp.biz.auth.dto.PasswordChangeReq;
import kr.co.kfs.asseterp.biz.auth.dto.PasswordCodeReq;
import kr.co.kfs.asseterp.biz.auth.dto.PasswordVerifyReq;
import kr.co.kfs.asseterp.biz.auth.service.AuthPasswordService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 로그인 전 비밀번호 변경·재설정 (AS-IS Sys25_Lookup_Password · Sys25_Lookup_Reset → server/sys/Sys25_Password, EE59·EE60).
 * 로그인 전에 부르므로 인증 없이 열려 있다(permit-all) — 검사는 서비스가 한다.
 */
@RestController
@RequestMapping("/api/auth/password")
@RequiredArgsConstructor
public class AuthPasswordController {

    private final AuthPasswordService service;

    /** AS-IS sys.Sys25_Password.getCode */
    @PostMapping("/code")
    public ApiResponse<Void> sendCode(@RequestBody PasswordCodeReq req) {
        service.sendCode(req);
        return ApiResponse.ok(null);
    }

    /** AS-IS Sys25_Lookup_Reset.resetPassword() 의 인증번호 비교 (서버에서) */
    @PostMapping("/verify")
    public ApiResponse<Void> verifyCode(@RequestBody PasswordVerifyReq req) {
        service.verifyCode(req);
        return ApiResponse.ok(null);
    }

    /** AS-IS sys.Sys25_Password.checkPassword · checkPasswordRule · insert */
    @PostMapping("/change")
    public ApiResponse<Void> change(@RequestBody PasswordChangeReq req) {
        service.change(req);
        return ApiResponse.ok("비밀번호 변경이 완료되었습니다", null);
    }

    /** AS-IS sys.Sys25_Password.extension */
    @PostMapping("/extension")
    public ApiResponse<Void> extension(@RequestBody PasswordChangeReq req) {
        service.extension(req.companyCode(), req.loginId(), req.currentPassword());
        return ApiResponse.ok("비밀번호 만료기한이 3개월 연장되었습니다", null);
    }
}
