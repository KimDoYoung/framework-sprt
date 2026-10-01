package com.asseterp.oms.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.util.List;

/**
 * 인증/세션 설정 (asseterp.auth.*)
 *
 * @param sessionKeyPrefix Redis 활성 JTI 키 prefix (뒤에 userId가 붙음)
 * @param defaultDeptId    부서(발령 조직)를 조회하기 전까지 사용할 부서 ID
 * @param defaultRole      토큰에 roles 클레임이 없을 때 부여할 권한
 * @param permitAllPaths   인증 없이 접근 가능한 경로 (정적 리소스, 공개 API)
 * @param refreshRotation  Refresh Token 교체(rotation) 및 재사용 탐지 설정
 * @param loginLock        로그인 실패 잠금 설정
 * @param passwordExpireDays 비밀번호 만료 경과일 (AS-IS 90일, sys25_password.sys25_work_date 기준)
 */
@ConfigurationProperties(prefix = "asseterp.auth")
public record AuthProperties(
        String sessionKeyPrefix,
        String defaultDeptId,
        String defaultRole,
        List<String> permitAllPaths,
        RefreshRotation refreshRotation,
        LoginLock loginLock,
        int passwordExpireDays
) {
    /**
     * @param keyPrefix         현재 유효한 Refresh Token ID(rid) 키 prefix
     * @param previousKeyPrefix 직전 rid 키 prefix (유예시간 동안만 보관)
     * @param gracePeriod       교체 직후 직전 토큰을 허용하는 시간 (여러 탭의 동시 갱신 오탐 방지)
     */
    public record RefreshRotation(
            String keyPrefix,
            String previousKeyPrefix,
            Duration gracePeriod
    ) {
    }

    /**
     * @param maxFailures         연속 실패 허용 횟수. 이 횟수에 도달하면 계정 잠금 (emp01_lock_yn='true')
     * @param failCountKeyPrefix  실패 횟수 Redis 키 prefix (뒤에 userId가 붙음)
     * @param failCountTtl        실패 횟수 유지 시간 (마지막 실패 후 이 시간이 지나면 0으로 초기화)
     */
    public record LoginLock(
            int maxFailures,
            String failCountKeyPrefix,
            Duration failCountTtl
    ) {
    }
}
