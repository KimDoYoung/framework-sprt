package kr.co.kfs.asseterp.common.jwt;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.config.properties.AuthProperties;
import kr.co.kfs.asseterp.common.config.properties.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenProvider {

    /** Access/Refresh 토큰을 구분하는 클레임. Refresh Token을 Access Token 자리에 쓰는 것을 막는다. */
    public enum TokenType { ACCESS, REFRESH }

    private static final String CLAIM_TOKEN_TYPE = "typ";
    /** Refresh Token 고유 ID. 갱신 때마다 새로 발급되어 재사용 탐지에 사용 */
    public static final String CLAIM_REFRESH_ID = "rid";
    /** 토큰을 발급한 호스트의 테넌트 코드 (서브도메인). 다른 서브도메인에서의 사용을 막는다 */
    public static final String CLAIM_TENANT = "tenant";

    private final JwtProperties jwtProperties;
    private final AuthProperties authProperties;
    private final SecretKey secretKey;

    public JwtTokenProvider(JwtProperties jwtProperties, AuthProperties authProperties) {
        this.jwtProperties = jwtProperties;
        this.authProperties = authProperties;
        this.secretKey = Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public long getAccessTokenExpiration() {
        return jwtProperties.accessTokenExpiration();
    }

    public long getRefreshTokenExpiration() {
        return jwtProperties.refreshTokenExpiration();
    }

    public String generateAccessToken(UserPrincipal principal, String jti) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.accessTokenExpiration());

        return Jwts.builder()
                .issuer(jwtProperties.issuer())
                .subject(String.valueOf(principal.getUserId()))
                .id(jti)
                .issuedAt(now)
                .expiration(expiryDate)
                .claim(CLAIM_TOKEN_TYPE, TokenType.ACCESS.name())
                .claim("username", principal.getUsername())
                .claim("login_id", principal.getLoginId())
                .claim("name", principal.getName())
                .claim("company_id", principal.getCompanyId())
                .claim("company_code", principal.getCompanyCode())
                .claim("company_name", principal.getCompanyName())
                .claim(CLAIM_TENANT, principal.getTenant())
                .claim("dept_id", principal.getDeptId())
                .claim("roles", principal.getRoles())
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public String generateRefreshToken(Long userId, String tenant, String jti, String refreshId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.refreshTokenExpiration());

        return Jwts.builder()
                .issuer(jwtProperties.issuer())
                .subject(String.valueOf(userId))
                .id(jti)
                .issuedAt(now)
                .expiration(expiryDate)
                .claim(CLAIM_TOKEN_TYPE, TokenType.REFRESH.name())
                .claim(CLAIM_REFRESH_ID, refreshId)
                .claim(CLAIM_TENANT, tenant)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * 서명·발급자·만료·토큰 타입을 검증하고 Claims를 반환한다.
     *
     * @throws io.jsonwebtoken.ExpiredJwtException 만료된 토큰
     * @throws io.jsonwebtoken.JwtException        서명/형식/발급자/타입 오류
     */
    public Claims parseClaims(String token, TokenType expectedType) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .requireIssuer(jwtProperties.issuer())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        if (!isTokenType(claims, expectedType)) {
            throw new UnsupportedJwtException("토큰 타입이 올바르지 않습니다. expected=" + expectedType);
        }
        return claims;
    }

    @SuppressWarnings("unchecked")
    /**
     * 토큰 종류(typ) 확인. 만료 예외(ExpiredJwtException)의 Claims처럼 parseClaims를 거치지 않은 Claims 검사용.
     */
    public boolean isTokenType(Claims claims, TokenType type) {
        return type.name().equals(claims.get(CLAIM_TOKEN_TYPE, String.class));
    }

    public UserPrincipal toUserPrincipal(Claims claims) {
        List<String> roles = claims.get("roles", List.class);

        return UserPrincipal.builder()
                .userId(Long.parseLong(claims.getSubject()))
                .username(claims.get("username", String.class))
                .loginId(claims.get("login_id", String.class))
                .name(claims.get("name", String.class))
                .companyId(claims.get("company_id", Long.class))
                .companyCode(claims.get("company_code", String.class))
                .companyName(claims.get("company_name", String.class))
                .tenant(claims.get(CLAIM_TENANT, String.class))
                .deptId(claims.get("dept_id", String.class))
                .roles(roles != null ? roles : List.of(authProperties.defaultRole()))
                .jti(claims.getId())
                .accessTokenExpiresAt(claims.getExpiration().toInstant())
                .build();
    }
}
