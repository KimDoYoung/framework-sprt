package com.asseterp.security.common.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisTokenService {

    private final StringRedisTemplate redisTemplate;

    private static final String KEY_PREFIX = "security:user:jti:";

    private String getKey(Long userId) {
        return KEY_PREFIX + userId;
    }

    /**
     * 사용자의 활성 jti를 Redis에 저장 (새 로그인 시 기존 jti를 덮어씀 -> 이전 접속 즉시 차단)
     */
    public void saveActiveJti(Long userId, String jti, Duration ttl) {
        String key = getKey(userId);
        redisTemplate.opsForValue().set(key, jti, ttl);
        log.info("Redis 활성 JTI 등록 완료 - userId: {}, jti: {}, ttl: {}ms", userId, jti, ttl.toMillis());
    }

    /**
     * 현재 요청의 jti가 사용자의 최신 활성 jti인지 검사
     */
    public boolean isLatestJti(Long userId, String jti) {
        String key = getKey(userId);
        String activeJti = redisTemplate.opsForValue().get(key);
        if (activeJti == null) {
            log.warn("Redis에 저장된 활성 JTI가 없습니다 - userId: {}", userId);
            return false;
        }
        boolean matched = activeJti.equals(jti);
        if (!matched) {
            log.warn("멀티 로그인 감지 (이전 세션 차단) - userId: {}, 요청 jti: {}, 활성 jti: {}", userId, jti, activeJti);
        }
        return matched;
    }

    /**
     * 로그아웃 시 활성 jti 제거
     */
    public void removeActiveJti(Long userId) {
        String key = getKey(userId);
        redisTemplate.delete(key);
        log.info("Redis 활성 JTI 제거 완료 - userId: {}", userId);
    }
}
