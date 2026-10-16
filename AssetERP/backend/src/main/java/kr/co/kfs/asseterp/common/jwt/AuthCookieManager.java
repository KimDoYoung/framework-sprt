package kr.co.kfs.asseterp.common.jwt;

import kr.co.kfs.asseterp.common.config.properties.JwtProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.Duration;

/**
 * 인증 토큰 쿠키(ACCESS_TOKEN / REFRESH_TOKEN)의 발급·삭제·조회를 담당한다.
 * <ul>
 *   <li>두 쿠키 모두 Refresh Token 수명 + 여유시간(jwt.cookie.max-age-margin)만큼 유지한다.
 *       토큰이 만료돼도 쿠키가 남아 서버가 TOKEN_EXPIRED / MULTI_LOGIN_DETECTED / REFRESH_EXPIRED를 판정하고,
 *       세션 만료를 누구의 것인지 감사 로그에 기록할 수 있게 하기 위함이다 (토큰 자체의 만료는 JWT exp로 검증).</li>
 *   <li>REFRESH_TOKEN은 {contextPath}{jwt.cookie.refresh-path} 경로에만 전송되도록 Path를 제한한다.</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
public class AuthCookieManager {

    private final JwtProperties jwtProperties;

    public void writeTokens(HttpServletRequest request, HttpServletResponse response,
                            String accessToken, String refreshToken) {
        Duration maxAge = Duration.ofMillis(jwtProperties.refreshTokenExpiration()).plus(cookie().maxAgeMargin());
        addCookie(response, cookie().accessTokenName(), accessToken, accessPath(request), maxAge);
        addCookie(response, cookie().refreshTokenName(), refreshToken, refreshPath(request), maxAge);
    }

    public void clearTokens(HttpServletRequest request, HttpServletResponse response) {
        addCookie(response, cookie().accessTokenName(), "", accessPath(request), Duration.ZERO);
        addCookie(response, cookie().refreshTokenName(), "", refreshPath(request), Duration.ZERO);
    }

    public String resolveAccessToken(HttpServletRequest request) {
        return resolveCookie(request, cookie().accessTokenName());
    }

    public String resolveRefreshToken(HttpServletRequest request) {
        return resolveCookie(request, cookie().refreshTokenName());
    }

    private void addCookie(HttpServletResponse response, String name, String value, String path, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(cookie().secure())
                .path(path)
                .maxAge(maxAge)
                .sameSite(cookie().sameSite())
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

    private JwtProperties.Cookie cookie() {
        return jwtProperties.cookie();
    }

    private String accessPath(HttpServletRequest request) {
        String contextPath = request.getContextPath();
        return StringUtils.hasText(contextPath) ? contextPath : "/";
    }

    private String refreshPath(HttpServletRequest request) {
        return request.getContextPath() + cookie().refreshPath();
    }
}
