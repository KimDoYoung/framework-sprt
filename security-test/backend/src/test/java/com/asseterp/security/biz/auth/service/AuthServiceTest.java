package com.asseterp.security.biz.auth.service;

import com.asseterp.security.biz.auth.dto.LoginReq;
import com.asseterp.security.biz.user.entity.AppUser;
import com.asseterp.security.biz.user.mapper.AppUserMapper;
import com.asseterp.security.common.config.properties.AuthProperties;
import com.asseterp.security.common.config.properties.JwtProperties;
import com.asseterp.security.common.error.BusinessException;
import com.asseterp.security.common.error.ErrorCode;
import com.asseterp.security.common.jwt.JwtTokenProvider;
import com.asseterp.security.common.jwt.RedisTokenService;
import com.asseterp.security.common.jwt.RedisTokenService.RotationResult;
import com.asseterp.security.common.jwt.RedisTokenService.RotationStatus;
import com.asseterp.security.support.TestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private final AppUserMapper appUserMapper = mock(AppUserMapper.class);
    private final RedisTokenService redisTokenService = mock(RedisTokenService.class);
    private final LoginLockService loginLockService = mock(LoginLockService.class);
    private final AuthProperties authProperties = TestProperties.bind("asseterp.auth", AuthProperties.class);
    private final JwtTokenProvider tokenProvider = new JwtTokenProvider(
            TestProperties.bind("jwt", JwtProperties.class), authProperties);

    private AuthService authService;

    @BeforeEach
    void setUp() {
        @SuppressWarnings("deprecation")
        NoOpPasswordEncoder encoder = (NoOpPasswordEncoder) NoOpPasswordEncoder.getInstance();
        authService = new AuthService(appUserMapper, encoder, tokenProvider, redisTokenService,
                authProperties, loginLockService);
    }

    private AppUser user(String lockYn) {
        return AppUser.builder().userId(2L).companyId(100).username("user1").password("1111")
                .fullName("일반 사용자").role("ROLE_USER").lockYn(lockYn).build();
    }

    @Test
    void 잠긴_계정은_비밀번호가_맞아도_거부되고_실패횟수도_늘지_않는다() {
        when(appUserMapper.findByUsername("user1")).thenReturn(Optional.of(user("Y")));

        assertThatThrownBy(() -> authService.login(new LoginReq("user1", "1111")))
                .isInstanceOfSatisfying(BusinessException.class,
                        e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.ACCOUNT_LOCKED));
        verify(loginLockService, never()).recordFailure(any());
        verify(redisTokenService, never()).startSession(any(), any(), any(), any());
    }

    @Test
    void 최대_횟수_전_실패는_남은_횟수를_안내한다() {
        when(appUserMapper.findByUsername("user1")).thenReturn(Optional.of(user("N")));
        when(loginLockService.recordFailure(2L)).thenReturn(new LoginLockService.FailureResult(1, 2, false));

        assertThatThrownBy(() -> authService.login(new LoginReq("user1", "wrong")))
                .isInstanceOfSatisfying(BusinessException.class, e -> {
                    assertThat(e.getErrorCode()).isEqualTo(ErrorCode.LOGIN_FAILED);
                    assertThat(e.getMessage()).contains("1/2회");
                });
    }

    @Test
    void 최대_횟수에_도달하면_계정_잠금으로_응답한다() {
        when(appUserMapper.findByUsername("user1")).thenReturn(Optional.of(user("N")));
        when(loginLockService.recordFailure(2L)).thenReturn(new LoginLockService.FailureResult(2, 2, true));

        assertThatThrownBy(() -> authService.login(new LoginReq("user1", "wrong")))
                .isInstanceOfSatisfying(BusinessException.class,
                        e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.ACCOUNT_LOCKED));
    }

    @Test
    void 로그인_성공_시_실패횟수를_초기화하고_세션을_등록한다() {
        when(appUserMapper.findByUsername("user1")).thenReturn(Optional.of(user("N")));

        authService.login(new LoginReq("user1", "1111"));

        verify(loginLockService).resetFailures(2L);
        verify(redisTokenService).startSession(eq(2L), anyString(), anyString(), any());
    }

    @Test
    void 이미_교체된_Refresh_Token이_오면_재사용으로_거부한다() {
        String refreshToken = tokenProvider.generateRefreshToken(2L, "jti-1", "old-rid");
        when(redisTokenService.rotateRefreshToken(eq(2L), eq("jti-1"), eq("old-rid"), anyString(), any()))
                .thenReturn(new RotationResult(RotationStatus.REUSED, null));

        assertThatThrownBy(() -> authService.refresh(refreshToken))
                .isInstanceOfSatisfying(BusinessException.class,
                        e -> assertThat(e.getErrorCode()).isEqualTo(ErrorCode.REFRESH_TOKEN_REUSED));
    }

    @Test
    void 정상_갱신_시_교체된_rid로_새_Refresh_Token을_발급한다() {
        String refreshToken = tokenProvider.generateRefreshToken(2L, "jti-1", "rid-1");
        when(redisTokenService.rotateRefreshToken(eq(2L), eq("jti-1"), eq("rid-1"), anyString(), any()))
                .thenReturn(new RotationResult(RotationStatus.ROTATED, "rid-2"));
        when(appUserMapper.findById(2L)).thenReturn(Optional.of(user("N")));

        String newRefreshToken = authService.refresh(refreshToken).refreshToken();

        String rid = tokenProvider.parseClaims(newRefreshToken, JwtTokenProvider.TokenType.REFRESH)
                .get(JwtTokenProvider.CLAIM_REFRESH_ID, String.class);
        assertThat(rid).isEqualTo("rid-2");
    }
}
