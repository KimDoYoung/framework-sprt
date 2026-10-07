package kr.co.kfs.asseterp.biz.push.controller;

import kr.co.kfs.asseterp.biz.push.dto.EchoReq;
import kr.co.kfs.asseterp.common.websocket.WsDestinations;
import kr.co.kfs.asseterp.common.websocket.dto.WsLevel;
import kr.co.kfs.asseterp.common.websocket.dto.WsMessage;
import kr.co.kfs.asseterp.common.websocket.dto.WsMessageType;
import kr.co.kfs.asseterp.common.websocket.dto.WsSender;
import kr.co.kfs.asseterp.common.websocket.dto.WsUser;
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
