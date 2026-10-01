package kr.co.kfs.asseterp.oms.biz.push.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.push.dto.NoticeReq;
import kr.co.kfs.asseterp.oms.biz.push.dto.NotificationReq;
import kr.co.kfs.asseterp.oms.biz.push.dto.PresenceItemRes;
import kr.co.kfs.asseterp.oms.biz.push.service.PresenceService;
import kr.co.kfs.asseterp.oms.biz.push.dto.ForceLogoutReq;
import kr.co.kfs.asseterp.oms.biz.push.dto.OnlineUserRes;
import kr.co.kfs.asseterp.oms.biz.push.service.PushAdminService;
import kr.co.kfs.asseterp.oms.biz.push.service.PushService;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * WebSocket push (관리자 전용): 전체 공지, 개인 알림 발송, 접속자 현황 조회
 */
@RestController
@RequestMapping("/api/push")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PushController {

    private final PushService pushService;
    private final PresenceService presenceService;
    private final PushAdminService pushAdminService;

    @PostMapping("/notice")
    public ApiResponse<String> createNotice(@Valid @RequestBody NoticeReq req,
                                            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("공지를 발송했습니다.", pushService.createNotice(req, principal));
    }

    @PostMapping("/notification")
    public ApiResponse<String> createNotification(@Valid @RequestBody NotificationReq req,
                                                  @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("알림을 발송했습니다.", pushService.createNotification(req, principal));
    }

    @GetMapping("/presence")
    public ApiResponse<List<PresenceItemRes>> searchPresence() {
        return ApiResponse.ok(presenceService.searchPresence());
    }

    // ── 로그아웃 알림 관리 (AS-IS Sys86_Tab_Websocket) — 전 고객사 접속자라 KFS 관리자(SYSADMIN)만 ──

    /** 접속 중 사원 */
    @GetMapping("/online-users")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<List<OnlineUserRes>> searchOnlineUsers(@RequestParam(required = false) Long companyId,
                                                              @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(pushAdminService.searchOnlineUsers(companyId, searchText));
    }

    /** 개별로그아웃 → 처리한 사용자 수 (자신은 제외) */
    @PostMapping("/force-logout")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<Integer> forceLogout(@RequestBody ForceLogoutReq req, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(pushAdminService.forceLogout(req.userIds(), principal));
    }

    /** 전체로그아웃 → 처리한 사용자 수 (자신은 제외) */
    @PostMapping("/force-logout-all")
    @PreAuthorize("hasRole('SYSADMIN')")
    public ApiResponse<Integer> forceLogoutAll(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(pushAdminService.forceLogoutAll(principal));
    }
}
