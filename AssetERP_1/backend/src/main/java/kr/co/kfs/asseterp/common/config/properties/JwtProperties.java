package kr.co.kfs.asseterp.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

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
     * @param refreshPath  REFRESH_TOKEN 쿠키 전송 경로 (컨텍스트 경로 이하, AuthController 매핑과 일치해야 함)
     * @param maxAgeMargin 쿠키 수명 여유시간. 쿠키 Max-Age = Refresh Token 수명 + 이 값.
     *                     토큰이 만료된 뒤에도 쿠키가 잠시 남아 서버가 누구의 세션이 만료됐는지 판정·기록할 수 있게 한다.
     */
    public record Cookie(
            boolean secure,
            String sameSite,
            String accessTokenName,
            String refreshTokenName,
            String refreshPath,
            Duration maxAgeMargin
    ) {
    }
}
