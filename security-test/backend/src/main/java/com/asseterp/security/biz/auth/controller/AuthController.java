package com.asseterp.security.biz.auth.controller;

import com.asseterp.security.biz.auth.dto.LoginReq;
import com.asseterp.security.biz.auth.dto.LoginRes;
import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.biz.auth.service.AuthService;
import com.asseterp.security.common.dto.ApiResponse;
import com.asseterp.security.common.jwt.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider tokenProvider;

    public static final String ACCESS_TOKEN_COOKIE = "ACCESS_TOKEN";
    public static final String REFRESH_TOKEN_COOKIE = "REFRESH_TOKEN";

    @PostMapping("/login")
    public ApiResponse<LoginRes> login(@RequestBody LoginReq req, HttpServletResponse response) {
        LoginRes loginRes = authService.login(req);

        // 1. Access Token 쿠키 (10초)
        ResponseCookie accessCookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE, loginRes.accessToken())
                .httpOnly(true)
                .secure(false) // 로컬 환경 호환
                .path("/")
                .maxAge(loginRes.accessTokenExpiresIn() / 1000)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

        // 2. Refresh Token 쿠키 (60초)
        ResponseCookie refreshCookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, loginRes.refreshToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(loginRes.refreshTokenExpiresIn() / 1000)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ApiResponse.ok("로그인에 성공했습니다.", loginRes);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginRes>> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = resolveRefreshToken(request);

        if (!StringUtils.hasText(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail("리프레시 토큰이 없습니다. 다시 로그인해주세요."));
        }

        try {
            LoginRes loginRes = authService.refresh(refreshToken);

            // 새 Access Token 쿠키 발급 (10초)
            ResponseCookie accessCookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE, loginRes.accessToken())
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(loginRes.accessTokenExpiresIn() / 1000)
                    .sameSite("Lax")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

            return ResponseEntity.ok(ApiResponse.ok("토큰이 갱신되었습니다.", loginRes));
        } catch (Exception e) {
            log.warn("토큰 갱신 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@AuthenticationPrincipal UserPrincipal principal, HttpServletResponse response) {
        if (principal != null) {
            authService.logout(principal.getUserId());
        }

        // 쿠키 만료
        ResponseCookie expiredAccessCookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, expiredAccessCookie.toString());

        ResponseCookie expiredRefreshCookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, expiredRefreshCookie.toString());

        return ApiResponse.ok("로그아웃되었습니다.", null);
    }

    @GetMapping("/me")
    public ApiResponse<UserPrincipal> me(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ApiResponse.fail("로그인이 필요합니다.");
        }
        return ApiResponse.ok(principal);
    }

    private String resolveRefreshToken(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (REFRESH_TOKEN_COOKIE.equals(cookie.getName()) && StringUtils.hasText(cookie.getValue())) {
                    return cookie.getValue();
                }
            }
        }
        String bearer = request.getHeader("X-Refresh-Token");
        if (StringUtils.hasText(bearer)) {
            return bearer;
        }
        return null;
    }
}
