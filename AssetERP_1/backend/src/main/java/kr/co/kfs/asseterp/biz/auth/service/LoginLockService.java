package kr.co.kfs.asseterp.biz.auth.service;

import kr.co.kfs.asseterp.biz.user.dto.LoginAccount;
import kr.co.kfs.asseterp.biz.user.mapper.AccountMapper;
import kr.co.kfs.asseterp.common.config.properties.AuthProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.function.Supplier;

/**
 * 로그인 실패 잠금 (AS-IS emp01_lock_yn 방식). 사원(emp01_person)만 대상이다.
 * 실패 횟수는 Redis에 세고, 최대 횟수에 도달하면 emp01_lock_yn='true'로 영구 잠금한다. 해제는 관리자만 가능.
 * AS-IS는 실패 횟수를 브라우저 변수(LoginPage.passWordCnt)로 세어 새로고침하면 초기화되었지만, TOBE는 서버에서 센다.
 * userId는 세션용 사용자 ID(LoginAccount.sessionUserId, 사원은 emp01_person_id)이다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoginLockService {

    private final StringRedisTemplate redisTemplate;
    private final AccountMapper accountMapper;
    private final AuthProperties authProperties;

    /**
     * @param failureCount 이번 실패를 포함한 연속 실패 횟수
     * @param locked       이번 실패로 계정이 잠겼는지 여부
     */
    public record FailureResult(int failureCount, int maxFailures, boolean locked) {
        public int remaining() {
            return Math.max(0, maxFailures - failureCount);
        }
    }

    private AuthProperties.LoginLock policy() {
        return authProperties.loginLock();
    }

    private String failCountKey(Long userId) {
        return policy().failCountKeyPrefix() + userId;
    }

    public int getFailureCount(Long userId) {
        String value = execute(() -> redisTemplate.opsForValue().get(failCountKey(userId)));
        return value != null ? Integer.parseInt(value) : 0;
    }

    /**
     * 로그인 실패 1회 기록. 최대 횟수에 도달하면 계정을 잠근다.
     * 호출한 쪽이 곧바로 예외를 던져 롤백되더라도 잠금은 반영되어야 하므로 별도 트랜잭션으로 커밋한다.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public FailureResult recordFailure(Long userId) {
        String key = failCountKey(userId);
        Long count = execute(() -> {
            Long incremented = redisTemplate.opsForValue().increment(key);
            redisTemplate.expire(key, policy().failCountTtl());
            return incremented;
        });
        int failureCount = count != null ? count.intValue() : 1;
        int maxFailures = policy().maxFailures();

        if (failureCount < maxFailures) {
            log.warn("로그인 실패 - userId: {}, 실패 {}/{}회", userId, failureCount, maxFailures);
            return new FailureResult(failureCount, maxFailures, false);
        }

        accountMapper.updateEmpLockYn(LoginAccount.toAccountId(userId), LoginAccount.LOCKED);
        execute(() -> redisTemplate.delete(key));
        log.warn("[보안] 로그인 {}회 실패로 계정 잠금 - userId: {}", failureCount, userId);
        return new FailureResult(failureCount, maxFailures, true);
    }

    /**
     * 로그인 성공 시 실패 횟수 초기화
     */
    public void resetFailures(Long userId) {
        execute(() -> redisTemplate.delete(failCountKey(userId)));
    }

    /**
     * 관리자 잠금 해제: emp01_lock_yn='false' + 실패 횟수 초기화
     */
    @Transactional
    public void unlock(Long userId) {
        accountMapper.updateEmpLockYn(LoginAccount.toAccountId(userId), LoginAccount.UNLOCKED);
        resetFailures(userId);
        log.info("계정 잠금 해제 - userId: {}", userId);
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
