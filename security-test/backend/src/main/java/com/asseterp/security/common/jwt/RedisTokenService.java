package com.asseterp.security.common.jwt;

import com.asseterp.security.common.config.properties.AuthProperties;
import com.asseterp.security.common.error.BusinessException;
import com.asseterp.security.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

/**
 * Redis 세션 저장소. 사용자별로 3개의 키를 관리한다.
 * <ul>
 *   <li>활성 jti: 동시 로그인 차단 (새 로그인 시 덮어씀)</li>
 *   <li>현재 rid: 유효한 Refresh Token ID (갱신 때마다 교체)</li>
 *   <li>직전 rid: 교체 직후 유예시간 동안만 보관 (여러 탭의 동시 갱신 허용)</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RedisTokenService {

    /** 요청 jti와 Redis 활성 jti의 비교 결과 */
    public enum JtiStatus {
        /** 최신 활성 세션 */
        MATCH,
        /** 다른 곳에서 새로 로그인되어 활성 jti가 바뀜 → 동시 로그인 차단 */
        MISMATCH,
        /** 활성 세션 없음 (로그아웃, TTL 만료, Redis 초기화) */
        NOT_FOUND
    }

    /** Refresh Token 교체 결과 */
    public enum RotationStatus {
        /** 현재 토큰 → 새 rid로 교체됨 */
        ROTATED,
        /** 직전 토큰이 유예시간 안에 들어옴 → 현재 rid로 재발급 */
        GRACE,
        MISMATCH,
        NOT_FOUND,
        /** 이미 교체된 토큰 재사용 → 세션 폐기됨 */
        REUSED
    }

    /**
     * @param refreshId 새로 발급할 Refresh Token의 rid (ROTATED/GRACE일 때만 값이 있음)
     */
    public record RotationResult(RotationStatus status, String refreshId) {
    }

    private static final RedisScript<String> ROTATE_SCRIPT =
            RedisScript.of(new ClassPathResource("redis/rotate-refresh-token.lua"), String.class);

    private final StringRedisTemplate redisTemplate;
    private final AuthProperties authProperties;

    private String jtiKey(Long userId) {
        return authProperties.sessionKeyPrefix() + userId;
    }

    private String refreshIdKey(Long userId) {
        return authProperties.refreshRotation().keyPrefix() + userId;
    }

    private String previousRefreshIdKey(Long userId) {
        return authProperties.refreshRotation().previousKeyPrefix() + userId;
    }

    /**
     * 새 세션 등록 (로그인). 기존 jti를 덮어써 이전 접속을 즉시 차단한다.
     */
    public void startSession(Long userId, String jti, String refreshId, Duration ttl) {
        execute(() -> {
            redisTemplate.opsForValue().set(jtiKey(userId), jti, ttl);
            redisTemplate.opsForValue().set(refreshIdKey(userId), refreshId, ttl);
            redisTemplate.delete(previousRefreshIdKey(userId));
            return null;
        });
        log.info("Redis 세션 등록 완료 - userId: {}, jti: {}, ttl: {}ms", userId, jti, ttl.toMillis());
    }

    /**
     * Refresh Token 교체. jti 검사(동시 로그인)와 rid 검사(재사용 탐지)를 원자적으로 수행한다.
     */
    public RotationResult rotateRefreshToken(Long userId, String jti, String refreshId,
                                             String newRefreshId, Duration ttl) {
        Duration gracePeriod = authProperties.refreshRotation().gracePeriod();
        String result = execute(() -> redisTemplate.execute(ROTATE_SCRIPT,
                List.of(jtiKey(userId), refreshIdKey(userId), previousRefreshIdKey(userId)),
                jti, refreshId, newRefreshId,
                String.valueOf(ttl.toMillis()), String.valueOf(gracePeriod.toMillis())));

        String[] parts = result.split(":", 2);
        RotationStatus status = RotationStatus.valueOf(parts[0]);
        switch (status) {
            case REUSED -> log.error("[보안] Refresh Token 재사용 탐지 → 세션 폐기 - userId: {}, jti: {}, rid: {}",
                    userId, jti, refreshId);
            case MISMATCH -> log.warn("멀티 로그인 감지 (Refresh 차단) - userId: {}, jti: {}", userId, jti);
            case GRACE -> log.info("유예시간 내 직전 Refresh Token 사용 (동시 갱신) - userId: {}, rid: {}", userId, refreshId);
            default -> { }
        }
        return new RotationResult(status, parts.length > 1 ? parts[1] : null);
    }

    /**
     * 현재 요청의 jti가 사용자의 최신 활성 jti인지 검사
     */
    public JtiStatus checkJti(Long userId, String jti) {
        String activeJti = execute(() -> redisTemplate.opsForValue().get(jtiKey(userId)));
        if (activeJti == null) {
            log.warn("Redis에 저장된 활성 JTI가 없습니다 - userId: {}", userId);
            return JtiStatus.NOT_FOUND;
        }
        if (!activeJti.equals(jti)) {
            log.warn("멀티 로그인 감지 (이전 세션 차단) - userId: {}, 요청 jti: {}, 활성 jti: {}", userId, jti, activeJti);
            return JtiStatus.MISMATCH;
        }
        return JtiStatus.MATCH;
    }

    /**
     * 활성 세션의 남은 수명(ms). 세션이 없으면 0.
     */
    public long getRemainingTtlMillis(Long userId) {
        Long ttl = execute(() -> redisTemplate.getExpire(jtiKey(userId), TimeUnit.MILLISECONDS));
        return ttl != null && ttl > 0 ? ttl : 0;
    }

    /**
     * 세션 제거 (로그아웃)
     */
    public void removeSession(Long userId) {
        execute(() -> redisTemplate.delete(List.of(jtiKey(userId), refreshIdKey(userId), previousRefreshIdKey(userId))));
        log.info("Redis 세션 제거 완료 - userId: {}", userId);
    }

    private <T> T execute(Supplier<T> action) {
        try {
            return action.get();
        } catch (DataAccessException e) {
            log.error("Redis 접근 실패: {}", e.getMessage());
            throw new BusinessException(ErrorCode.SESSION_STORE_UNAVAILABLE);
        }
    }
}
