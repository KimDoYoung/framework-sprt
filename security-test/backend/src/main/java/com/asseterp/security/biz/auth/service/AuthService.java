package com.asseterp.security.biz.auth.service;

import com.asseterp.security.biz.auth.dto.AuthResult;
import com.asseterp.security.biz.auth.dto.LoginReq;
import com.asseterp.security.biz.auth.dto.LoginRes;
import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.biz.user.entity.AppUser;
import com.asseterp.security.biz.user.mapper.AppUserMapper;
import com.asseterp.security.common.config.properties.AuthProperties;
import com.asseterp.security.common.error.BusinessException;
import com.asseterp.security.common.error.ErrorCode;
import com.asseterp.security.common.jwt.JwtTokenProvider;
import com.asseterp.security.common.jwt.JwtTokenProvider.TokenType;
import com.asseterp.security.common.jwt.RedisTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final AppUserMapper appUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RedisTokenService redisTokenService;
    private final AuthProperties authProperties;
    private final LoginLockService loginLockService;

    public AuthResult login(LoginReq req) {
        log.info("로그인 시도: username={}", req.username());

        AppUser user = appUserMapper.findByUsername(req.username())
                .orElseThrow(() -> {
                    log.warn("로그인 실패 (없는 아이디): username={}", req.username());
                    return new BusinessException(ErrorCode.LOGIN_FAILED);
                });

        // 잠긴 계정은 비밀번호를 검사하지 않음 (잠긴 뒤의 무차별 대입 차단)
        if (user.isLocked()) {
            log.warn("잠긴 계정 로그인 시도: username={}", req.username());
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }

        // 요구사항 6: 평문 패스워드 비교
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            LoginLockService.FailureResult failure = loginLockService.recordFailure(user.getUserId());
            if (failure.locked()) {
                throw new BusinessException(ErrorCode.ACCOUNT_LOCKED,
                        "로그인 " + failure.maxFailures() + "회 실패로 계정이 잠겼습니다. 관리자에게 잠금 해제를 요청하세요.");
            }
            throw new BusinessException(ErrorCode.LOGIN_FAILED,
                    ErrorCode.LOGIN_FAILED.getMessage() + " (실패 " + failure.failureCount() + "/" + failure.maxFailures()
                            + "회, " + failure.remaining() + "회 더 실패하면 계정이 잠깁니다.)");
        }
        loginLockService.resetFailures(user.getUserId());

        // 고유 jti 생성 (요구사항 7, 8) - 새 jti로 Redis를 덮어써 기존 세션을 차단
        String jti = UUID.randomUUID().toString();
        String refreshId = UUID.randomUUID().toString();
        AuthResult result = issueTokens(user, jti, refreshId);
        redisTokenService.startSession(user.getUserId(), jti, refreshId, sessionTtl());

        log.info("로그인 성공: userId={}, username={}, jti={}", user.getUserId(), user.getUsername(), jti);
        return result;
    }

    /**
     * Refresh Token을 통한 토큰 재발급 (Silent Refresh + Sliding Session + Rotation).
     * Access Token과 함께 새 rid의 Refresh Token을 재발급하여, 활동이 이어지는 한 세션이 연장된다.
     * 이미 교체된 Refresh Token이 다시 오면 탈취로 판단하여 세션 전체를 폐기한다.
     */
    public AuthResult refresh(String refreshToken) {
        if (!StringUtils.hasText(refreshToken)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        Claims claims;
        try {
            claims = tokenProvider.parseClaims(refreshToken, TokenType.REFRESH);
        } catch (ExpiredJwtException e) {
            throw new BusinessException(ErrorCode.REFRESH_EXPIRED);
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("유효하지 않은 Refresh Token: {}", e.getMessage());
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }

        Long userId = Long.parseLong(claims.getSubject());
        String jti = claims.getId();
        String refreshId = claims.get(JwtTokenProvider.CLAIM_REFRESH_ID, String.class);
        if (!StringUtils.hasText(refreshId)) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }

        // 멀티 로그인(jti) + 재사용(rid) 검사 후 새 rid로 교체 - Redis에서 원자적으로 처리
        RedisTokenService.RotationResult rotation = redisTokenService.rotateRefreshToken(
                userId, jti, refreshId, UUID.randomUUID().toString(), sessionTtl());
        switch (rotation.status()) {
            case MISMATCH -> throw new BusinessException(ErrorCode.MULTI_LOGIN_DETECTED);
            case NOT_FOUND -> throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
            case REUSED -> throw new BusinessException(ErrorCode.REFRESH_TOKEN_REUSED);
            case ROTATED, GRACE -> { }
        }

        AppUser user = appUserMapper.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));
        // 세션 도중 계정이 잠긴 경우 갱신 거부
        if (user.isLocked()) {
            redisTokenService.removeSession(userId);
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }

        AuthResult result = issueTokens(user, jti, rotation.refreshId());

        log.info("토큰 갱신(Refresh) 성공: userId={}, username={}, jti={}", userId, user.getUsername(), jti);
        return result;
    }

    /**
     * 현재 세션 정보와 남은 수명 조회
     */
    public LoginRes getMe(UserPrincipal principal) {
        long accessRemain = Math.max(0,
                Duration.between(Instant.now(), principal.getAccessTokenExpiresAt()).toMillis());
        long refreshRemain = redisTokenService.getRemainingTtlMillis(principal.getUserId());
        return toLoginRes(principal, accessRemain, refreshRemain);
    }

    /**
     * 로그아웃: Refresh Token의 jti가 현재 활성 세션일 때만 Redis에서 제거한다.
     * (이미 다른 곳에서 새로 로그인된 경우, 이전 세션의 로그아웃이 새 세션을 끊지 않도록)
     */
    public void logout(String refreshToken) {
        if (!StringUtils.hasText(refreshToken)) {
            return;
        }
        try {
            Claims claims = tokenProvider.parseClaims(refreshToken, TokenType.REFRESH);
            Long userId = Long.parseLong(claims.getSubject());
            if (redisTokenService.checkJti(userId, claims.getId()) == RedisTokenService.JtiStatus.MATCH) {
                redisTokenService.removeSession(userId);
                log.info("로그아웃 완료: userId={}", userId);
            }
        } catch (JwtException | IllegalArgumentException e) {
            // 만료/위조 토큰: 제거할 활성 세션이 없으므로 쿠키 삭제만 진행
            log.debug("로그아웃 시 Refresh Token 무시: {}", e.getMessage());
        }
    }

    private Duration sessionTtl() {
        return Duration.ofMillis(tokenProvider.getRefreshTokenExpiration());
    }

    /**
     * 토큰 발급. Redis 세션 등록/연장은 호출한 쪽(login: startSession, refresh: rotateRefreshToken)에서 처리한다.
     */
    private AuthResult issueTokens(AppUser user, String jti, String refreshId) {
        // app_user에 부서 컬럼이 없어 설정값(asseterp.auth.default-dept-id)을 사용
        UserPrincipal principal = UserPrincipal.from(user, jti, authProperties.defaultDeptId());
        String accessToken = tokenProvider.generateAccessToken(principal, jti);
        String refreshToken = tokenProvider.generateRefreshToken(user.getUserId(), jti, refreshId);

        LoginRes loginRes = toLoginRes(principal, tokenProvider.getAccessTokenExpiration(),
                tokenProvider.getRefreshTokenExpiration());
        return new AuthResult(loginRes, accessToken, refreshToken);
    }

    private LoginRes toLoginRes(UserPrincipal principal, long accessTokenExpiresIn, long refreshTokenExpiresIn) {
        return new LoginRes(
                principal.getUserId(),
                principal.getUsername(),
                principal.getName(),
                principal.getCompanyId(),
                principal.getDeptId(),
                principal.getRoles(),
                principal.getJti(),
                accessTokenExpiresIn,
                refreshTokenExpiresIn,
                tokenProvider.getAccessTokenExpiration(),
                tokenProvider.getRefreshTokenExpiration()
        );
    }
}
