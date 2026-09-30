package com.asseterp.security.biz.auth.controller;

import com.asseterp.security.biz.auth.dto.AuthResult;
import com.asseterp.security.biz.auth.dto.LoginReq;
import com.asseterp.security.biz.auth.dto.LoginRes;
import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.biz.auth.service.AuthService;
import com.asseterp.security.common.dto.ApiResponse;
import com.asseterp.security.common.jwt.AuthCookieManager;
import com.asseterp.security.common.tenant.TenantFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthCookieManager cookieManager;

    @PostMapping("/login")
    public ApiResponse<LoginRes> login(@RequestBody LoginReq req,
                                       HttpServletRequest request,
                                       HttpServletResponse response) {
        AuthResult result = authService.login(req, TenantFilter.current(request),
                request.getRemoteAddr(), request.getHeader(HttpHeaders.USER_AGENT));
        cookieManager.writeTokens(request, response, result.accessToken(), result.refreshToken());
        return ApiResponse.ok("로그인에 성공했습니다.", result.loginRes());
    }

    @PostMapping("/refresh")
    public ApiResponse<LoginRes> refresh(HttpServletRequest request, HttpServletResponse response) {
        AuthResult result = authService.refresh(cookieManager.resolveRefreshToken(request), TenantFilter.current(request));
        // Access Token + Refresh Token 모두 재발급 (Sliding Session)
        cookieManager.writeTokens(request, response, result.accessToken(), result.refreshToken());
        return ApiResponse.ok("토큰이 갱신되었습니다.", result.loginRes());
    }

    /**
     * 로그아웃은 Access Token 만료 여부와 무관하게 호출 가능하도록 permitAll로 열고,
     * Refresh Token 쿠키로 세션을 식별한다.
     */
    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(cookieManager.resolveRefreshToken(request));
        cookieManager.clearTokens(request, response);
        return ApiResponse.ok("로그아웃되었습니다.", null);
    }

    @GetMapping("/me")
    public ApiResponse<LoginRes> me(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(authService.getMe(principal));
    }
}
