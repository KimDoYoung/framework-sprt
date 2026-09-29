package com.asseterp.security.common.jwt;

import com.asseterp.security.common.error.BusinessException;
import com.asseterp.security.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

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

    private final StringRedisTemplate redisTemplate;

    private static final String KEY_PREFIX = "security:user:jti:";

    private String getKey(Long userId) {
        return KEY_PREFIX + userId;
    }

    /**
     * 사용자의 활성 jti를 Redis에 저장 (새 로그인 시 기존 jti를 덮어씀 -> 이전 접속 즉시 차단)
     */
    public void saveActiveJti(Long userId, String jti, Duration ttl) {
        execute(() -> {
            redisTemplate.opsForValue().set(getKey(userId), jti, ttl);
            return null;
        });
        log.info("Redis 활성 JTI 등록 완료 - userId: {}, jti: {}, ttl: {}ms", userId, jti, ttl.toMillis());
    }

    /**
     * 현재 요청의 jti가 사용자의 최신 활성 jti인지 검사
     */
    public JtiStatus checkJti(Long userId, String jti) {
        String activeJti = execute(() -> redisTemplate.opsForValue().get(getKey(userId)));
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
        Long ttl = execute(() -> redisTemplate.getExpire(getKey(userId), TimeUnit.MILLISECONDS));
        return ttl != null && ttl > 0 ? ttl : 0;
    }

    /**
     * 로그아웃 시 활성 jti 제거
     */
    public void removeActiveJti(Long userId) {
        execute(() -> redisTemplate.delete(getKey(userId)));
        log.info("Redis 활성 JTI 제거 완료 - userId: {}", userId);
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
