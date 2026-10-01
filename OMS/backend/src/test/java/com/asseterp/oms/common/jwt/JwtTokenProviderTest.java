package com.asseterp.oms.common.jwt;

import com.asseterp.oms.biz.auth.dto.UserPrincipal;
import com.asseterp.oms.common.config.properties.AuthProperties;
import com.asseterp.oms.common.config.properties.JwtProperties;
import com.asseterp.oms.common.jwt.JwtTokenProvider.TokenType;
import com.asseterp.oms.support.TestProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtTokenProviderTest {

    private JwtTokenProvider provider;

    private final UserPrincipal principal = UserPrincipal.builder()
            .userId(-1L).username("admin:admin").loginId("admin").name("시스템 관리자")
            .companyId(0L).companyCode("admin").companyName("ADMIN").tenant("admin")
            .deptId("D101").roles(List.of("ROLE_ADMIN")).jti("jti-1")
            .build();

    @BeforeEach
    void setUp() {
        provider = newProvider(10_000, 60_000);
    }

    private JwtTokenProvider newProvider(long accessExp, long refreshExp) {
        JwtProperties base = TestProperties.bind("jwt", JwtProperties.class);
        JwtProperties jwtProperties = new JwtProperties(base.secret(), base.issuer(), accessExp, refreshExp, base.cookie());
        return new JwtTokenProvider(jwtProperties, TestProperties.bind("asseterp.auth", AuthProperties.class));
    }

    @Test
    void Access_Token을_파싱하면_Principal이_복원된다() {
        Claims claims = provider.parseClaims(provider.generateAccessToken(principal, "jti-1"), TokenType.ACCESS);
        UserPrincipal restored = provider.toUserPrincipal(claims);

        assertThat(restored.getUserId()).isEqualTo(-1L);
        assertThat(restored.getCompanyId()).isEqualTo(0L);
        assertThat(restored.getCompanyCode()).isEqualTo("admin");
        assertThat(restored.getTenant()).isEqualTo("admin");
        assertThat(restored.getJti()).isEqualTo("jti-1");
        assertThat(restored.getRoles()).containsExactly("ROLE_ADMIN");
        assertThat(restored.getAccessTokenExpiresAt()).isNotNull();
    }

    @Test
    void int_범위를_넘는_회사ID도_복원된다() {
        UserPrincipal bigCompany = UserPrincipal.builder()
                .userId(202404021662972L).username("miraeassettest:001").companyId(202404021662972L)
                .roles(List.of("ROLE_USER")).jti("jti-1").tenant("miraeassettest").build();
        UserPrincipal restored = provider.toUserPrincipal(
                provider.parseClaims(provider.generateAccessToken(bigCompany, "jti-1"), TokenType.ACCESS));

        assertThat(restored.getCompanyId()).isEqualTo(202404021662972L);
    }

    @Test
    void Refresh_Token은_Access_Token으로_사용할_수_없다() {
        String refreshToken = provider.generateRefreshToken(1L, "kfstest", "jti-1", "rid-1");
        assertThatThrownBy(() -> provider.parseClaims(refreshToken, TokenType.ACCESS))
                .isInstanceOf(JwtException.class);
    }

    @Test
    void Refresh_Token에는_재사용_탐지용_rid가_담긴다() {
        Claims claims = provider.parseClaims(provider.generateRefreshToken(1L, "kfstest", "jti-1", "rid-1"), TokenType.REFRESH);
        assertThat(claims.get(JwtTokenProvider.CLAIM_REFRESH_ID, String.class)).isEqualTo("rid-1");
        assertThat(claims.get(JwtTokenProvider.CLAIM_TENANT, String.class)).isEqualTo("kfstest");
        assertThat(claims.getId()).isEqualTo("jti-1");
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
