package com.asseterp.security.biz.user.controller;

import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.biz.user.dto.UserItemRes;
import com.asseterp.security.biz.user.service.UserService;
import com.asseterp.security.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 사용자 관리 (관리자 전용): 계정 목록 조회, 로그인 잠금 해제
 */
@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping("/list")
    public ApiResponse<List<UserItemRes>> searchUsers() {
        return ApiResponse.ok(userService.searchUsers());
    }

    @PostMapping("/{userId}/unlock")
    public ApiResponse<Void> updateUserUnlock(@PathVariable("userId") Long userId,
                                              @AuthenticationPrincipal UserPrincipal principal) {
        userService.updateUserUnlock(userId);
        log.info("관리자 잠금 해제 - 대상 userId: {}, 처리자: {}", userId, principal.getUsername());
        return ApiResponse.ok("계정 잠금이 해제되었습니다.", null);
    }
}
