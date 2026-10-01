package com.asseterp.oms.biz.push.controller;

import com.asseterp.oms.biz.push.dto.EchoReq;
import com.asseterp.oms.common.websocket.WsDestinations;
import com.asseterp.oms.common.websocket.dto.WsLevel;
import com.asseterp.oms.common.websocket.dto.WsMessage;
import com.asseterp.oms.common.websocket.dto.WsMessageType;
import com.asseterp.oms.common.websocket.dto.WsSender;
import com.asseterp.oms.common.websocket.dto.WsUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

/**
 * 클라이언트 → 서버 STOMP 메시지 (/app/**)
 */
@Slf4j
@Controller
public class PushStompController {

    /**
     * 양방향 통신 확인: 보낸 세션에만 ECHO로 되돌려 준다.
     */
    @MessageMapping("/echo")
    @SendToUser(destinations = WsDestinations.QUEUE_NOTIFICATIONS, broadcast = false)
    public WsMessage<Void> echo(EchoReq req, SimpMessageHeaderAccessor accessor) {
        WsUser user = (WsUser) accessor.getSessionAttributes().get(WsUser.ATTRIBUTE);
        String text = req != null && req.text() != null ? req.text() : "";
        log.info("WebSocket echo - sessionId: {}, text: {}", accessor.getSessionId(), text);
        return WsMessage.of(WsMessageType.ECHO, WsLevel.INFO, "Echo", text, null,
                new WsSender(user.username(), user.name()));
    }
}
