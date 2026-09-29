package com.asseterp.security.common.jwt;

import com.asseterp.security.biz.auth.dto.UserPrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.issuer:asset-erp}")
    private String issuer;

    @Getter
    @Value("${jwt.access-token-expiration:10000}")
    private long accessTokenExpiration;

    @Getter
    @Value("${jwt.refresh-token-expiration:60000}")
    private long refreshTokenExpiration;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(UserPrincipal principal, String jti) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenExpiration);

        return Jwts.builder()
                .issuer(issuer)
                .subject(String.valueOf(principal.getUserId()))
                .id(jti)
                .issuedAt(now)
                .expiration(expiryDate)
                .claim(CLAIM_TOKEN_TYPE, TokenType.ACCESS.name())
                .claim("username", principal.getUsername())
                .claim("name", principal.getName())
                .claim("company_id", principal.getCompanyId())
                .claim("dept_id", principal.getDeptId() != null ? principal.getDeptId() : "D101")
                .claim("roles", principal.getRoles())
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public String generateRefreshToken(Long userId, String jti) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpiration);

        return Jwts.builder()
                .issuer(issuer)
                .subject(String.valueOf(userId))
                .id(jti)
                .issuedAt(now)
                .expiration(expiryDate)
                .claim(CLAIM_TOKEN_TYPE, TokenType.REFRESH.name())
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
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        if (!expectedType.name().equals(claims.get(CLAIM_TOKEN_TYPE, String.class))) {
            throw new UnsupportedJwtException("토큰 타입이 올바르지 않습니다. expected=" + expectedType);
        }
        return claims;
    }

    @SuppressWarnings("unchecked")
    public UserPrincipal toUserPrincipal(Claims claims) {
        List<String> roles = claims.get("roles", List.class);

        return UserPrincipal.builder()
                .userId(Long.parseLong(claims.getSubject()))
                .username(claims.get("username", String.class))
                .name(claims.get("name", String.class))
                .companyId(claims.get("company_id", Integer.class))
                .deptId(claims.get("dept_id", String.class))
                .roles(roles != null ? roles : List.of("ROLE_USER"))
                .jti(claims.getId())
                .accessTokenExpiresAt(claims.getExpiration().toInstant())
                .build();
    }
}
