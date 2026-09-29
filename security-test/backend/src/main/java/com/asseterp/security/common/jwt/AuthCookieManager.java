package com.asseterp.security.common.jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.Duration;

/**
 * 인증 토큰 쿠키(ACCESS_TOKEN / REFRESH_TOKEN)의 발급·삭제·조회를 담당한다.
 * <ul>
 *   <li>두 쿠키 모두 Refresh Token 수명만큼 유지한다. Access Token이 만료돼도 쿠키는 남아 서버가
 *       TOKEN_EXPIRED / MULTI_LOGIN_DETECTED를 판정할 수 있게 하기 위함이다(토큰 자체의 만료는 JWT exp로 검증).</li>
 *   <li>REFRESH_TOKEN은 {contextPath}/api/auth 경로에만 전송되도록 Path를 제한한다.</li>
 * </ul>
 */
@Component
public class AuthCookieManager {

    public static final String ACCESS_TOKEN_COOKIE = "ACCESS_TOKEN";
    public static final String REFRESH_TOKEN_COOKIE = "REFRESH_TOKEN";
    private static final String REFRESH_COOKIE_SUB_PATH = "/api/auth";

    private final JwtTokenProvider tokenProvider;
    private final boolean secure;

    public AuthCookieManager(JwtTokenProvider tokenProvider,
                             @Value("${jwt.cookie-secure:false}") boolean secure) {
        this.tokenProvider = tokenProvider;
        this.secure = secure;
    }

    public void writeTokens(HttpServletRequest request, HttpServletResponse response,
                            String accessToken, String refreshToken) {
        Duration maxAge = Duration.ofMillis(tokenProvider.getRefreshTokenExpiration());
        addCookie(response, ACCESS_TOKEN_COOKIE, accessToken, accessPath(request), maxAge);
        addCookie(response, REFRESH_TOKEN_COOKIE, refreshToken, refreshPath(request), maxAge);
    }

    public void clearTokens(HttpServletRequest request, HttpServletResponse response) {
        addCookie(response, ACCESS_TOKEN_COOKIE, "", accessPath(request), Duration.ZERO);
        addCookie(response, REFRESH_TOKEN_COOKIE, "", refreshPath(request), Duration.ZERO);
    }

    public String resolveAccessToken(HttpServletRequest request) {
        return resolveCookie(request, ACCESS_TOKEN_COOKIE);
    }

    public String resolveRefreshToken(HttpServletRequest request) {
        return resolveCookie(request, REFRESH_TOKEN_COOKIE);
    }

    private void addCookie(HttpServletResponse response, String name, String value, String path, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .path(path)
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String resolveCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) {
            return null;
        }
        for (Cookie cookie : request.getCookies()) {
            if (name.equals(cookie.getName()) && StringUtils.hasText(cookie.getValue())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private String accessPath(HttpServletRequest request) {
        String contextPath = request.getContextPath();
        return StringUtils.hasText(contextPath) ? contextPath : "/";
    }

    private String refreshPath(HttpServletRequest request) {
        return request.getContextPath() + REFRESH_COOKIE_SUB_PATH;
    }
}
