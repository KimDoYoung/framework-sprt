package kr.co.kfs.asseterp.oms.common.websocket;

import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import kr.co.kfs.asseterp.oms.common.jwt.RedisTokenService;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ExecutorChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

/**
 * 클라이언트 → 서버 STOMP 프레임 검사 (clientInboundChannel).
 * <ul>
 *   <li>CONNECT: handshake에서 인증된 사용자 정보가 있어야 한다.</li>
 *   <li>SUBSCRIBE: 허용된 목적지만, /topic/presence는 관리자만 구독할 수 있다.</li>
 *   <li>SEND: /app 이하만 허용 (클라이언트가 /topic에 직접 보내 공지를 위장하는 것을 막는다).</li>
 *   <li>SUBSCRIBE/SEND 때마다 Redis 활성 jti를 재검사한다 (멀티 로그인·로그아웃·만료된 소켓 차단).</li>
 * </ul>
 * 거부는 BusinessException으로 던지고, StompErrorHandler가 WsMessage ERROR 형식의 ERROR 프레임으로 바꾼다.
 * Spring Security messaging은 CONNECT에 CSRF 토큰을 요구해 쿠키 인증 구조와 맞지 않으므로 사용하지 않는다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ExecutorChannelInterceptor {

    private static final Set<String> USER_SUBSCRIPTIONS = Set.of(
            WsDestinations.USER_PREFIX + WsDestinations.QUEUE_SESSION,
            WsDestinations.USER_PREFIX + WsDestinations.QUEUE_NOTIFICATIONS,
            WsDestinations.TOPIC_NOTICE);
    private static final Set<String> ADMIN_SUBSCRIPTIONS = Set.of(WsDestinations.TOPIC_PRESENCE);

    private final RedisTokenService redisTokenService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null || accessor.getCommand() == null) {
            return message; // heartbeat
        }
        WsUser user = userOf(accessor.getSessionAttributes());
        WsMdc.put(user, null);
        try {
            StompCommand command = accessor.getCommand();
            switch (command) {
                case CONNECT, STOMP -> requireUser(user);
                case SUBSCRIBE -> {
                    requireUser(user);
                    checkSubscription(user, accessor.getDestination());
                    checkSession(user);
                }
                case SEND -> {
                    requireUser(user);
                    String destination = accessor.getDestination();
                    if (destination == null || !destination.startsWith(WsDestinations.APP_PREFIX + "/")) {
                        throw deny(user, command, destination);
                    }
                    checkSession(user);
                }
                default -> { }
            }
            return message;
        } finally {
            MDC.clear();
        }
    }

    /**
     * @MessageMapping 핸들러는 다른 스레드에서 실행되므로 그 스레드에도 MDC를 채운다.
     */
    @Override
    public Message<?> beforeHandle(Message<?> message, MessageChannel channel, MessageHandler handler) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor != null && accessor.getCommand() == StompCommand.SEND) {
            WsMdc.put(userOf(accessor.getSessionAttributes()), null);
        }
        return message;
    }

    @Override
    public void afterMessageHandled(Message<?> message, MessageChannel channel, MessageHandler handler, Exception ex) {
        MDC.clear();
    }

    private static WsUser userOf(Map<String, Object> attributes) {
        return attributes != null && attributes.get(WsUser.ATTRIBUTE) instanceof WsUser user ? user : null;
    }

    private static void requireUser(WsUser user) {
        if (user == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
    }

    private static void checkSubscription(WsUser user, String destination) {
        if (destination != null && USER_SUBSCRIPTIONS.contains(destination)) {
            return;
        }
        if (destination != null && ADMIN_SUBSCRIPTIONS.contains(destination) && user.isAdmin()) {
            return;
        }
        throw deny(user, StompCommand.SUBSCRIBE, destination);
    }

    private static BusinessException deny(WsUser user, StompCommand command, String destination) {
        log.warn("WebSocket 목적지 거부 - command: {}, destination: {}, user: {}", command, destination, user.username());
        return new BusinessException(ErrorCode.WS_DESTINATION_DENIED);
    }

    private void checkSession(WsUser user) {
        switch (redisTokenService.checkJti(user.userId(), user.jti())) {
            case MATCH -> { }
            case MISMATCH -> throw new BusinessException(ErrorCode.MULTI_LOGIN_DETECTED);
            case NOT_FOUND -> throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
        }
    }
}
