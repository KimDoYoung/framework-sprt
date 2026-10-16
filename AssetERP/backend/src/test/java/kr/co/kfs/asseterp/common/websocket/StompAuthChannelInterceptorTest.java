package kr.co.kfs.asseterp.common.websocket;

import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.jwt.RedisTokenService;
import kr.co.kfs.asseterp.common.jwt.RedisTokenService.JtiStatus;
import kr.co.kfs.asseterp.common.websocket.dto.WsUser;
import org.junit.jupiter.api.Test;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class StompAuthChannelInterceptorTest {

    private final RedisTokenService redisTokenService = mock(RedisTokenService.class);
    private final StompAuthChannelInterceptor interceptor = new StompAuthChannelInterceptor(redisTokenService);
    private final MessageChannel channel = mock(MessageChannel.class);

    private static WsUser user(String role) {
        return new WsUser(2L, "user1", "사용자", "jti-1", List.of(role), "127.0.0.1", Instant.now());
    }

    private static Message<byte[]> frame(StompCommand command, String destination, WsUser user) {
        StompHeaderAccessor accessor = StompHeaderAccessor.create(command);
        accessor.setDestination(destination);
        accessor.setSessionId("s1");
        Map<String, Object> attributes = new HashMap<>();
        if (user != null) {
            attributes.put(WsUser.ATTRIBUTE, user);
        }
        accessor.setSessionAttributes(attributes);
        accessor.setLeaveMutable(true);
        return MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());
    }

    private static void assertDenied(Runnable call, ErrorCode expected) {
        assertThatThrownBy(call::run)
                .isInstanceOfSatisfying(BusinessException.class, e -> assertThat(e.getErrorCode()).isEqualTo(expected));
    }

    @Test
    void 사용자_정보_없는_CONNECT는_거부한다() {
        assertDenied(() -> interceptor.preSend(frame(StompCommand.CONNECT, null, null), channel), ErrorCode.UNAUTHORIZED);
    }

    @Test
    void 허용된_목적지는_구독할_수_있다() {
        when(redisTokenService.checkJti(2L, "jti-1")).thenReturn(JtiStatus.MATCH);

        assertThatCode(() -> {
            interceptor.preSend(frame(StompCommand.SUBSCRIBE, "/user/queue/session", user("ROLE_USER")), channel);
            interceptor.preSend(frame(StompCommand.SUBSCRIBE, "/user/queue/notifications", user("ROLE_USER")), channel);
            interceptor.preSend(frame(StompCommand.SUBSCRIBE, "/topic/notice", user("ROLE_USER")), channel);
        }).doesNotThrowAnyException();
    }

    @Test
    void 일반_사용자는_접속자_현황을_구독할_수_없다() {
        assertDenied(() -> interceptor.preSend(frame(StompCommand.SUBSCRIBE, "/topic/presence", user("ROLE_USER")), channel),
                ErrorCode.WS_DESTINATION_DENIED);
    }

    @Test
    void 관리자는_접속자_현황을_구독할_수_있다() {
        when(redisTokenService.checkJti(2L, "jti-1")).thenReturn(JtiStatus.MATCH);

        assertThatCode(() -> interceptor.preSend(
                frame(StompCommand.SUBSCRIBE, "/topic/presence", user("ROLE_ADMIN")), channel)).doesNotThrowAnyException();
    }

    @Test
    void 다른_사용자의_목적지나_미등록_목적지는_거부한다() {
        assertDenied(() -> interceptor.preSend(
                frame(StompCommand.SUBSCRIBE, "/user/admin/queue/notifications", user("ROLE_USER")), channel),
                ErrorCode.WS_DESTINATION_DENIED);
        assertDenied(() -> interceptor.preSend(frame(StompCommand.SUBSCRIBE, "/topic/other", user("ROLE_USER")), channel),
                ErrorCode.WS_DESTINATION_DENIED);
    }

    @Test
    void 클라이언트가_topic으로_직접_보내는_것은_거부한다() {
        assertDenied(() -> interceptor.preSend(frame(StompCommand.SEND, "/topic/notice", user("ROLE_ADMIN")), channel),
                ErrorCode.WS_DESTINATION_DENIED);
    }

    @Test
    void 다른_곳에서_새로_로그인된_세션의_프레임은_거부한다() {
        when(redisTokenService.checkJti(2L, "jti-1")).thenReturn(JtiStatus.MISMATCH);

        assertDenied(() -> interceptor.preSend(frame(StompCommand.SEND, "/app/echo", user("ROLE_USER")), channel),
                ErrorCode.MULTI_LOGIN_DETECTED);
    }

    @Test
    void 만료된_세션의_프레임은_거부한다() {
        when(redisTokenService.checkJti(2L, "jti-1")).thenReturn(JtiStatus.NOT_FOUND);

        assertDenied(() -> interceptor.preSend(frame(StompCommand.SUBSCRIBE, "/topic/notice", user("ROLE_USER")), channel),
                ErrorCode.SESSION_NOT_FOUND);
    }
}
