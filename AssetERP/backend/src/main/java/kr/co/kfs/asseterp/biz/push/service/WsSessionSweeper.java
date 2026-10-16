package kr.co.kfs.asseterp.biz.push.service;

import kr.co.kfs.asseterp.biz.auth.dto.SessionTerminateReason;
import kr.co.kfs.asseterp.common.config.properties.WebSocketProperties;
import kr.co.kfs.asseterp.common.jwt.RedisTokenService;
import kr.co.kfs.asseterp.common.log.MdcKeys;
import kr.co.kfs.asseterp.common.log.MdcLoggingFilter;
import kr.co.kfs.asseterp.common.websocket.WebSocketConfig;
import kr.co.kfs.asseterp.common.websocket.WsSessionRegistry;
import kr.co.kfs.asseterp.common.websocket.WsSessionTerminator;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;

/**
 * 연결된 WebSocket 세션 주기 재검증 (asseterp.ws.sweep-interval).
 * 소켓은 연결 후 JWT 만료와 무관하게 유지되므로, Redis 활성 jti와 대조해 끝난 세션을 닫는다.
 * <ul>
 *   <li>NOT_FOUND: 유휴 시간 초과로 Redis 세션 만료 → EXPIRED (Redis 키 만료 이벤트 설정이 없어도 동작)</li>
 *   <li>MISMATCH: 멀티 로그인 알림이 유실된 경우(Redis 일시 장애 등)의 보정 → MULTI_LOGIN</li>
 * </ul>
 * 같은 주기에 인스턴스 생존 키도 갱신한다.
 */
@Slf4j
@Component
public class WsSessionSweeper {

    private final TaskScheduler taskScheduler;
    private final WsSessionRegistry sessionRegistry;
    private final WsSessionTerminator sessionTerminator;
    private final RedisTokenService redisTokenService;
    private final PresenceService presenceService;
    private final WebSocketProperties properties;

    public WsSessionSweeper(@Qualifier(WebSocketConfig.TASK_SCHEDULER) TaskScheduler taskScheduler,
                            WsSessionRegistry sessionRegistry,
                            WsSessionTerminator sessionTerminator,
                            RedisTokenService redisTokenService,
                            PresenceService presenceService,
                            WebSocketProperties properties) {
        this.taskScheduler = taskScheduler;
        this.sessionRegistry = sessionRegistry;
        this.sessionTerminator = sessionTerminator;
        this.redisTokenService = redisTokenService;
        this.presenceService = presenceService;
        this.properties = properties;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void start() {
        taskScheduler.scheduleWithFixedDelay(this::sweep, properties.sweepInterval());
        log.info("WebSocket 세션 재검증 시작 - 주기: {}, instanceId: {}", properties.sweepInterval(), properties.instanceId());
    }

    void sweep() {
        MDC.put(MdcKeys.TRACE_ID, MdcLoggingFilter.newTraceId());
        try {
            presenceService.heartbeat();
            for (WsSessionRegistry.Entry entry : sessionRegistry.getAll()) {
                if (entry.closing().get()) {
                    continue;
                }
                SessionTerminateReason reason = switch (redisTokenService.checkJti(entry.user().userId(), entry.user().jti())) {
                    case MATCH -> null;
                    case MISMATCH -> SessionTerminateReason.MULTI_LOGIN;
                    case NOT_FOUND -> SessionTerminateReason.EXPIRED;
                };
                if (reason != null) {
                    sessionTerminator.terminate(entry, PushService.sessionTerminatedMessage(reason), reason.name());
                }
            }
        } catch (RuntimeException e) {
            // Redis 장애 시 이번 주기는 건너뛴다 (장애 중에는 세션 판정 불가 → 연결 유지, HTTP 요청은 503)
            log.warn("WebSocket 세션 재검증 실패 - cause: {}", e.getMessage());
        } finally {
            MDC.clear();
        }
    }
}
