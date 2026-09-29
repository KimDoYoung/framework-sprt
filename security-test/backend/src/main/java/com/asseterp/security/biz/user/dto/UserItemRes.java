package com.asseterp.security.biz.user.dto;

/**
 * 관리자 사용자 목록 항목
 *
 * @param lockYn       잠금여부 (Y/N)
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
