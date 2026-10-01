package kr.co.kfs.asseterp.oms.biz.test.controller;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final AtomicLong callCounter = new AtomicLong(0);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    public record PingRes(
            long callSeq,
            String serverTime,
            String username,
            String name,
            String jti,
            String message
    ) {}

    @GetMapping("/ping")
    public ApiResponse<PingRes> ping(@AuthenticationPrincipal UserPrincipal principal) {
        long seq = callCounter.incrementAndGet();
        String serverTime = LocalDateTime.now().format(FORMATTER);

        log.info("서버 통신 ping 호출 (#{}) - user: {}, jti: {}", seq, principal.getUsername(), principal.getJti());

        PingRes data = new PingRes(
                seq,
                serverTime,
                principal.getUsername(),
                principal.getName(),
                principal.getJti(),
                "서버와 정상적으로 통신했습니다. (인증 세션 유효)"
        );

        return ApiResponse.ok("통신 성공", data);
    }
}
