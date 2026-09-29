package com.asseterp.security.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * JWT 및 인증 쿠키 설정 (jwt.*)
 *
 * @param accessTokenExpiration  Access Token 수명(ms)
 * @param refreshTokenExpiration Refresh Token 수명(ms) = 세션 유휴 만료 시간
 */
@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
        String secret,
        String issuer,
        long accessTokenExpiration,
        long refreshTokenExpiration,
        Cookie cookie
) {
    /**
     * @param refreshPath REFRESH_TOKEN 쿠키 전송 경로 (컨텍스트 경로 이하, AuthController 매핑과 일치해야 함)
     */
    public record Cookie(
            boolean secure,
            String sameSite,
            String accessTokenName,
            String refreshTokenName,
            String refreshPath
    ) {
    }
}
