package kr.co.kfs.asseterp.oms.biz.push.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.push.dto.NoticeReq;
import kr.co.kfs.asseterp.oms.biz.push.dto.NotificationReq;
import kr.co.kfs.asseterp.oms.biz.push.dto.PresenceItemRes;
import kr.co.kfs.asseterp.oms.biz.push.service.PresenceService;
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
}
