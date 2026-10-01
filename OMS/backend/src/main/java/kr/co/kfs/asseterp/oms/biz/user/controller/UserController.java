package kr.co.kfs.asseterp.oms.biz.user.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.user.dto.UserItemRes;
import kr.co.kfs.asseterp.oms.biz.user.service.UserService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 사용자 관리 (관리자 전용): 관리자 회사의 사원 목록 조회, 로그인 잠금 해제
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping("/list")
    public ApiResponse<List<UserItemRes>> searchUsers(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(userService.searchUsers(principal));
    }

    @PostMapping("/{userId}/unlock")
    public ApiResponse<Void> updateUserUnlock(@PathVariable("userId") Long userId,
                                              @AuthenticationPrincipal UserPrincipal principal) {
        userService.updateUserUnlock(userId, principal);
        return ApiResponse.ok("계정 잠금이 해제되었습니다.", null);
    }
}
