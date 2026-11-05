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

    /**
     * "로그인 상태유지" 표시 쿠키 (AS-IS LoginPage autoLoginCBox → SessionCookies pc_save / init).
     * 있으면 토큰 쿠키를 Max-Age 있는 영구 쿠키로, 없으면 브라우저를 닫으면 사라지는 세션 쿠키로 쓴다.
     */
    private static final String KEEP_LOGIN_COOKIE = "KEEP_LOGIN";

    /** 로그인: 화면의 "로그인 상태유지" 체크에 따라 쿠키 수명을 정하고 그 선택을 기억한다 */
    public void writeLoginTokens(HttpServletRequest request, HttpServletResponse response,
                                 String accessToken, String refreshToken, boolean keepLogin) {
        Duration maxAge = keepLogin ? tokenMaxAge() : null;
        addCookie(response, KEEP_LOGIN_COOKIE, keepLogin ? "1" : "", accessPath(request), keepLogin ? maxAge : Duration.ZERO);
        writeTokens(response, request, accessToken, refreshToken, maxAge);
    }

    /** 갱신·겸직전환: 로그인 때 고른 "로그인 상태유지"를 그대로 따른다 */
    public void writeTokens(HttpServletRequest request, HttpServletResponse response,
                            String accessToken, String refreshToken) {
        boolean keepLogin = resolveCookie(request, KEEP_LOGIN_COOKIE) != null;
        if (keepLogin) addCookie(response, KEEP_LOGIN_COOKIE, "1", accessPath(request), tokenMaxAge());
        writeTokens(response, request, accessToken, refreshToken, keepLogin ? tokenMaxAge() : null);
    }

    private void writeTokens(HttpServletResponse response, HttpServletRequest request,
                             String accessToken, String refreshToken, Duration maxAge) {
        addCookie(response, cookie().accessTokenName(), accessToken, accessPath(request), maxAge);
        addCookie(response, cookie().refreshTokenName(), refreshToken, refreshPath(request), maxAge);
    }

    private Duration tokenMaxAge() {
        return Duration.ofMillis(jwtProperties.refreshTokenExpiration()).plus(cookie().maxAgeMargin());
    }

    public void clearTokens(HttpServletRequest request, HttpServletResponse response) {
        addCookie(response, cookie().accessTokenName(), "", accessPath(request), Duration.ZERO);
        addCookie(response, cookie().refreshTokenName(), "", refreshPath(request), Duration.ZERO);
        addCookie(response, KEEP_LOGIN_COOKIE, "", accessPath(request), Duration.ZERO);
    }

    public String resolveAccessToken(HttpServletRequest request) {
        return resolveCookie(request, cookie().accessTokenName());
    }

    public String resolveRefreshToken(HttpServletRequest request) {
        return resolveCookie(request, cookie().refreshTokenName());
    }

    /** maxAge가 null이면 세션 쿠키(Max-Age 없음) */
    private void addCookie(HttpServletResponse response, String name, String value, String path, Duration maxAge) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(cookie().secure())
                .path(path)
                .sameSite(cookie().sameSite());
        if (maxAge != null) builder.maxAge(maxAge);
        ResponseCookie cookie = builder.build();
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
