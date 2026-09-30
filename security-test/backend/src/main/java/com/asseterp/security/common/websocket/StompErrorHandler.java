package com.asseterp.security.common.websocket;

import com.asseterp.security.common.error.BusinessException;
import com.asseterp.security.common.error.ErrorCode;
import com.asseterp.security.common.websocket.dto.ErrorPayload;
import com.asseterp.security.common.websocket.dto.WsLevel;
import com.asseterp.security.common.websocket.dto.WsMessage;
import com.asseterp.security.common.websocket.dto.WsMessageType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

import java.nio.charset.StandardCharsets;

/**
 * 클라이언트 프레임 처리 중 오류를 STOMP ERROR 프레임으로 변환한다.
 * ERROR 프레임의 message 헤더에는 ErrorCode 이름을, 본문에는 WsMessage(type=ERROR) JSON을 담는다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StompErrorHandler extends StompSubProtocolErrorHandler {

    private final ObjectMapper objectMapper;

    @Override
    public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {
        ErrorCode errorCode = findErrorCode(ex);
        String message = errorCode.getMessage();
        if (errorCode == ErrorCode.INTERNAL_ERROR) {
            log.error("STOMP 프레임 처리 오류", ex);
        }

        StompHeaderAccessor errorAccessor = StompHeaderAccessor.create(StompCommand.ERROR);
        errorAccessor.setMessage(errorCode.name());
        errorAccessor.setContentType(MimeTypeUtils.APPLICATION_JSON);
        errorAccessor.setLeaveMutable(true);

        StompHeaderAccessor clientAccessor = clientMessage != null
                ? MessageHeaderAccessor.getAccessor(clientMessage, StompHeaderAccessor.class)
                : null;
        return handleInternal(errorAccessor, toJson(errorCode, message), ex, clientAccessor);
    }

    private byte[] toJson(ErrorCode errorCode, String message) {
        WsMessage<ErrorPayload> body = WsMessage.of(WsMessageType.ERROR, WsLevel.ERROR, "WebSocket 오류", message,
                new ErrorPayload(errorCode.name()), null);
        try {
            return objectMapper.writeValueAsBytes(body);
        } catch (JsonProcessingException e) {
            return message.getBytes(StandardCharsets.UTF_8);
        }
    }

    private static ErrorCode findErrorCode(Throwable ex) {
        for (Throwable cause = ex; cause != null; cause = cause.getCause()) {
            if (cause instanceof BusinessException businessException) {
                return businessException.getErrorCode();
            }
        }
        return ErrorCode.INTERNAL_ERROR;
    }
}
