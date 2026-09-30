package com.asseterp.security.biz.auth.service;

import com.asseterp.security.biz.audit.dto.AuditEventType;
import com.asseterp.security.biz.audit.dto.AuditResult;
import com.asseterp.security.biz.audit.service.AuditLogService;
import com.asseterp.security.biz.auth.dto.AuthResult;
import com.asseterp.security.biz.auth.dto.LoginReq;
import com.asseterp.security.biz.auth.dto.LoginRes;
import com.asseterp.security.biz.auth.dto.SessionTerminateReason;
import com.asseterp.security.biz.auth.dto.SessionTerminatedEvent;
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
import org.springframework.context.ApplicationEventPublisher;
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
    private final AuditLogService auditLogService;
    /** 세션 종료 이벤트 → push 도메인이 WebSocket으로 즉시 알림 (SessionTerminatedEvent) */
    private final ApplicationEventPublisher eventPublisher;

    public AuthResult login(LoginReq req) {
        log.info("로그인 시도: username={}", req.username());

        AppUser user = appUserMapper.findByUsername(req.username())
                .orElseThrow(() -> {
                    log.warn("로그인 실패 (없는 아이디): username={}", req.username());
                    auditLogService.record(AuditEventType.LOGIN_FAIL, AuditResult.FAIL, req.username(), null, "없는 아이디");
                    return new BusinessException(ErrorCode.LOGIN_FAILED);
                });

        // 잠긴 계정은 비밀번호를 검사하지 않음 (잠긴 뒤의 무차별 대입 차단)
        if (user.isLocked()) {
            log.warn("잠긴 계정 로그인 시도: username={}", req.username());
            auditLogService.record(AuditEventType.LOGIN_LOCKED_ATTEMPT, AuditResult.FAIL, user.getUsername(), null, null);
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }

        // 요구사항 6: 평문 패스워드 비교
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            LoginLockService.FailureResult failure = loginLockService.recordFailure(user.getUserId());
            if (failure.locked()) {
                auditLogService.record(AuditEventType.ACCOUNT_LOCKED, AuditResult.FAIL, user.getUsername(), null,
                        "로그인 " + failure.failureCount() + "회 연속 실패");
                // 다른 곳에 살아 있는 세션도 즉시 종료 (HTTP 요청은 다음 갱신 때 거부됨)
                publishSessionTerminated(user.getUserId(), null, SessionTerminateReason.ACCOUNT_LOCKED);
                throw new BusinessException(ErrorCode.ACCOUNT_LOCKED,
                        "로그인 " + failure.maxFailures() + "회 실패로 계정이 잠겼습니다. 관리자에게 잠금 해제를 요청하세요.");
            }
            auditLogService.record(AuditEventType.LOGIN_FAIL, AuditResult.FAIL, user.getUsername(), null,
                    "비밀번호 불일치 (" + failure.failureCount() + "/" + failure.maxFailures() + ")");
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
        // 이전 세션(다른 jti)의 WebSocket에 즉시 알림 - 다음 요청을 기다리지 않고 차단
        publishSessionTerminated(user.getUserId(), jti, SessionTerminateReason.MULTI_LOGIN);

        log.info("로그인 성공: userId={}, username={}, jti={}", user.getUserId(), user.getUsername(), jti);
        auditLogService.record(AuditEventType.LOGIN_SUCCESS, AuditResult.SUCCESS, user.getUsername(), null, "jti=" + jti);
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
            // 서명이 검증된 만료 토큰이므로 Claims의 사용자로 만료를 기록한다 (쿠키 여유시간 jwt.cookie.max-age-margin 동안 도착)
            if (tokenProvider.isTokenType(e.getClaims(), TokenType.REFRESH)) {
                auditRefreshRejected(Long.parseLong(e.getClaims().getSubject()), ErrorCode.REFRESH_EXPIRED);
            }
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
            case MISMATCH -> {
                auditLogService.record(AuditEventType.MULTI_LOGIN_BLOCKED, AuditResult.FAIL, usernameOf(userId), null,
                        "Refresh 차단, jti=" + jti);
                throw new BusinessException(ErrorCode.MULTI_LOGIN_DETECTED);
            }
            case NOT_FOUND -> {
                auditRefreshRejected(userId, ErrorCode.SESSION_NOT_FOUND);
                throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
            }
            case REUSED -> {
                auditLogService.record(AuditEventType.TOKEN_REUSED, AuditResult.FAIL, usernameOf(userId), null,
                        "세션 폐기, jti=" + jti + ", rid=" + refreshId);
                publishSessionTerminated(userId, null, SessionTerminateReason.TOKEN_REUSED);
                throw new BusinessException(ErrorCode.REFRESH_TOKEN_REUSED);
            }
            case ROTATED, GRACE -> { }
        }

        AppUser user = appUserMapper.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));
        // 세션 도중 계정이 잠긴 경우 갱신 거부
        if (user.isLocked()) {
            redisTokenService.removeSession(userId);
            publishSessionTerminated(userId, null, SessionTerminateReason.ACCOUNT_LOCKED);
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
                auditLogService.record(AuditEventType.LOGOUT, AuditResult.SUCCESS, usernameOf(userId), null, null);
                // 같은 세션을 쓰는 다른 탭도 로그인 화면으로
                publishSessionTerminated(userId, null, SessionTerminateReason.LOGOUT);
            }
        } catch (JwtException | IllegalArgumentException e) {
            // 만료/위조 토큰: 제거할 활성 세션이 없으므로 쿠키 삭제만 진행
            log.debug("로그아웃 시 Refresh Token 무시: {}", e.getMessage());
        }
    }

    /**
     * 만료되었거나 이미 끝난 세션으로 갱신을 시도한 경우 (세션 만료 후 사용자가 다시 요청한 시점)
     */
    private void auditRefreshRejected(Long userId, ErrorCode reason) {
        auditLogService.record(AuditEventType.REFRESH_REJECTED, AuditResult.FAIL, usernameOf(userId), null,
                reason.name() + ": " + reason.getMessage());
    }

    /**
     * 감사 로그용 로그인 아이디 (토큰에는 숫자 userId만 있음)
     */
    private String usernameOf(Long userId) {
        return appUserMapper.findById(userId)
                .map(AppUser::getUsername)
                .orElse(String.valueOf(userId));
    }

    private void publishSessionTerminated(Long userId, String keepJti, SessionTerminateReason reason) {
        eventPublisher.publishEvent(new SessionTerminatedEvent(userId, keepJti, reason));
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
