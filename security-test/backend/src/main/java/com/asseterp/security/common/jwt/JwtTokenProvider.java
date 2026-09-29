package com.asseterp.security.common.jwt;

import com.asseterp.security.biz.auth.dto.UserPrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
public class JwtTokenProvider {

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
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("만료된 JWT 토큰입니다: {}", e.getMessage());
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("유효하지 않은 JWT 토큰입니다: {}", e.getMessage());
        }
        return false;
    }

    public String getJti(String token) {
        return parseClaims(token).getId();
    }

    public Long getUserId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    @SuppressWarnings("unchecked")
    public UserPrincipal getUserPrincipal(String token) {
        Claims claims = parseClaims(token);
        Long userId = Long.parseLong(claims.getSubject());
        String username = claims.get("username", String.class);
        String name = claims.get("name", String.class);
        Integer companyId = claims.get("company_id", Integer.class);
        String deptId = claims.get("dept_id", String.class);
        List<String> roles = claims.get("roles", List.class);
        String jti = claims.getId();

        return UserPrincipal.builder()
                .userId(userId)
                .username(username)
                .name(name)
                .companyId(companyId)
                .deptId(deptId)
                .roles(roles != null ? roles : List.of("ROLE_USER"))
                .jti(jti)
                .build();
    }
}
