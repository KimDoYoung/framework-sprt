package com.asseterp.security.biz.auth.service;

import com.asseterp.security.biz.auth.dto.AuthResult;
import com.asseterp.security.biz.auth.dto.LoginReq;
import com.asseterp.security.biz.auth.dto.LoginRes;
import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.biz.user.entity.AppUser;
import com.asseterp.security.biz.user.mapper.AppUserMapper;
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

    public AuthResult login(LoginReq req) {
        log.info("로그인 시도: username={}", req.username());

        // 요구사항 6: 평문 패스워드 비교. 아이디/비밀번호 오류는 동일 메시지로 응답(계정 존재 여부 노출 방지)
        AppUser user = appUserMapper.findByUsername(req.username())
                .filter(u -> passwordEncoder.matches(req.password(), u.getPassword()))
                .orElseThrow(() -> {
                    log.warn("로그인 실패: username={}", req.username());
                    return new BusinessException(ErrorCode.LOGIN_FAILED);
                });

        // 고유 jti 생성 (요구사항 7, 8) - 새 jti로 Redis를 덮어써 기존 세션을 차단
        String jti = UUID.randomUUID().toString();
        AuthResult result = issueTokens(user, jti);

        log.info("로그인 성공: userId={}, username={}, jti={}", user.getUserId(), user.getUsername(), jti);
        return result;
    }

    /**
     * Refresh Token을 통한 토큰 재발급 (Silent Refresh + Sliding Session).
     * Access Token과 함께 Refresh Token도 새 만료시각으로 재발급하여, 활동이 이어지는 한 세션이 연장된다.
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

        // 멀티 로그인 여부 검사 (Redis의 활성 JTI 확인)
        switch (redisTokenService.checkJti(userId, jti)) {
            case MISMATCH -> throw new BusinessException(ErrorCode.MULTI_LOGIN_DETECTED);
            case NOT_FOUND -> throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
            case MATCH -> { }
        }

        AppUser user = appUserMapper.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SESSION_NOT_FOUND));

        AuthResult result = issueTokens(user, jti);

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
                redisTokenService.removeActiveJti(userId);
                log.info("로그아웃 완료: userId={}", userId);
            }
        } catch (JwtException | IllegalArgumentException e) {
            // 만료/위조 토큰: 제거할 활성 세션이 없으므로 쿠키 삭제만 진행
            log.debug("로그아웃 시 Refresh Token 무시: {}", e.getMessage());
        }
    }

    private AuthResult issueTokens(AppUser user, String jti) {
        UserPrincipal principal = UserPrincipal.from(user, jti);
        String accessToken = tokenProvider.generateAccessToken(principal, jti);
        String refreshToken = tokenProvider.generateRefreshToken(user.getUserId(), jti);

        // Redis TTL = Refresh Token 수명 (로그인 시 등록, 갱신 시 연장)
        long refreshExpiration = tokenProvider.getRefreshTokenExpiration();
        redisTokenService.saveActiveJti(user.getUserId(), jti, Duration.ofMillis(refreshExpiration));

        LoginRes loginRes = toLoginRes(principal, tokenProvider.getAccessTokenExpiration(), refreshExpiration);
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
                refreshTokenExpiresIn
        );
    }
}
