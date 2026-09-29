package com.asseterp.security.common.jwt;

import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.common.jwt.JwtTokenProvider.TokenType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtTokenProviderTest {

    private JwtTokenProvider provider;

    private final UserPrincipal principal = UserPrincipal.builder()
            .userId(1L).username("admin").name("시스템 관리자").companyId(100)
            .deptId("D101").roles(List.of("ROLE_ADMIN")).jti("jti-1")
            .build();

    @BeforeEach
    void setUp() {
        provider = newProvider(10_000, 60_000);
    }

    private JwtTokenProvider newProvider(long accessExp, long refreshExp) {
        JwtTokenProvider p = new JwtTokenProvider();
        ReflectionTestUtils.setField(p, "secret", "test-secret-key-for-hmac-sha-256-must-be-at-least-32-bytes");
        ReflectionTestUtils.setField(p, "issuer", "asset-erp");
        ReflectionTestUtils.setField(p, "accessTokenExpiration", accessExp);
        ReflectionTestUtils.setField(p, "refreshTokenExpiration", refreshExp);
        p.init();
        return p;
    }

    @Test
    void Access_Token을_파싱하면_Principal이_복원된다() {
        Claims claims = provider.parseClaims(provider.generateAccessToken(principal, "jti-1"), TokenType.ACCESS);
        UserPrincipal restored = provider.toUserPrincipal(claims);

        assertThat(restored.getUserId()).isEqualTo(1L);
        assertThat(restored.getJti()).isEqualTo("jti-1");
        assertThat(restored.getRoles()).containsExactly("ROLE_ADMIN");
        assertThat(restored.getAccessTokenExpiresAt()).isNotNull();
    }

    @Test
    void Refresh_Token은_Access_Token으로_사용할_수_없다() {
        String refreshToken = provider.generateRefreshToken(1L, "jti-1");
        assertThatThrownBy(() -> provider.parseClaims(refreshToken, TokenType.ACCESS))
                .isInstanceOf(JwtException.class);
    }

    @Test
    void Access_Token은_Refresh_Token으로_사용할_수_없다() {
        String accessToken = provider.generateAccessToken(principal, "jti-1");
        assertThatThrownBy(() -> provider.parseClaims(accessToken, TokenType.REFRESH))
                .isInstanceOf(JwtException.class);
    }

    @Test
    void 만료된_토큰은_ExpiredJwtException() {
        JwtTokenProvider expired = newProvider(-1_000, -1_000);
        String token = expired.generateAccessToken(principal, "jti-1");
        assertThatThrownBy(() -> provider.parseClaims(token, TokenType.ACCESS))
                .isInstanceOf(ExpiredJwtException.class);
    }
}
