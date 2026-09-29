package com.asseterp.security.biz.auth.controller;

import com.asseterp.security.biz.auth.dto.LoginReq;
import com.asseterp.security.biz.auth.dto.LoginRes;
import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.biz.auth.service.AuthService;
import com.asseterp.security.common.dto.ApiResponse;
import com.asseterp.security.common.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ApiResponse<LoginRes> login(@RequestBody LoginReq req, HttpServletResponse response) {
        LoginRes loginRes = authService.login(req);

        // 요구사항 1: JWT 베이스, 쿠키 사용
        ResponseCookie cookie = ResponseCookie.from("ACCESS_TOKEN", loginRes.accessToken())
                .httpOnly(true)
                .secure(false) // 로컬 환경 HTTP 호환
                .path("/")
                .maxAge(tokenProvider.getRefreshTokenExpiration() / 1000)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ApiResponse.ok("로그인에 성공했습니다.", loginRes);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@AuthenticationPrincipal UserPrincipal principal, HttpServletResponse response) {
        if (principal != null) {
            authService.logout(principal.getUserId());
        }

        // 쿠키 만료
        ResponseCookie cookie = ResponseCookie.from("ACCESS_TOKEN", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ApiResponse.ok("로그아웃되었습니다.", null);
    }

    @GetMapping("/me")
    public ApiResponse<UserPrincipal> me(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ApiResponse.fail("로그인이 필요합니다.");
        }
        return ApiResponse.ok(principal);
    }
}
