package com.asseterp.security.biz.user.dto;

/**
 * 관리자 사용자 목록 항목 (로그인한 관리자 회사의 사원, emp01_person)
 *
 * @param userId       세션용 사용자 ID (= emp01_person_id)
 * @param username     로그인 ID (사번)
 * @param lockYn       잠금여부 (AS-IS emp01_lock_yn: 'true'/'false'/null)
 * @param failureCount 현재 연속 로그인 실패 횟수
 */
public record UserItemRes(
        Long userId,
        String username,
        String fullName,
        String role,
        String lockYn,
        int failureCount
) {
}
