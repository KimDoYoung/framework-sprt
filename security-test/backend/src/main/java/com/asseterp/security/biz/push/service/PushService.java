package com.asseterp.security.biz.push.service;

import com.asseterp.security.biz.audit.dto.AuditEventType;
import com.asseterp.security.biz.audit.dto.AuditResult;
import com.asseterp.security.biz.audit.service.AuditLogService;
import com.asseterp.security.biz.auth.dto.SessionTerminateReason;
import com.asseterp.security.biz.auth.dto.SessionTerminatedEvent;
import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.biz.push.dto.NoticeReq;
import com.asseterp.security.biz.push.dto.NotificationPayload;
import com.asseterp.security.biz.push.dto.NotificationReq;
import com.asseterp.security.biz.push.dto.SessionTerminatedPayload;
import com.asseterp.security.biz.user.mapper.AppUserMapper;
import com.asseterp.security.common.error.BusinessException;
import com.asseterp.security.common.error.ErrorCode;
import com.asseterp.security.common.websocket.WsDestinations;
import com.asseterp.security.common.websocket.WsPublisher;
import com.asseterp.security.common.websocket.dto.WsLevel;
import com.asseterp.security.common.websocket.dto.WsMessage;
import com.asseterp.security.common.websocket.dto.WsMessageType;
import com.asseterp.security.common.websocket.dto.WsRoute;
import com.asseterp.security.common.websocket.dto.WsSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 서버발 WebSocket 메시지: 전체 공지, 개인 알림, 세션 종료 알림
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PushService {

    private final WsPublisher wsPublisher;
    private final AppUserMapper appUserMapper;
    private final AuditLogService auditLogService;

    /**
     * 전체 공지 (/topic/notice)
     *
     * @return 발송한 메시지 ID
     */
    public String createNotice(NoticeReq req, UserPrincipal sender) {
        WsMessage<Void> message = WsMessage.of(WsMessageType.NOTICE, levelOrInfo(req.level()),
                req.title(), req.message(), null, senderOf(sender));
        wsPublisher.publish(WsRoute.all(WsDestinations.TOPIC_NOTICE), message);

        auditLogService.record(AuditEventType.NOTICE_BROADCAST, AuditResult.SUCCESS, sender.getUsername(), message.id(),
                req.title());
        return message.id();
    }

    /**
     * 개인 알림 (/user/queue/notifications). 받는 사용자가 접속해 있지 않으면 전달되지 않는다 (저장하지 않음).
     *
     * @return 발송한 메시지 ID
     */
    public String createNotification(NotificationReq req, UserPrincipal sender) {
        if (appUserMapper.findByUsername(req.username()).isEmpty()) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        WsMessage<NotificationPayload> message = WsMessage.of(WsMessageType.NOTIFICATION, levelOrInfo(req.level()),
                req.title(), req.message(), new NotificationPayload(req.link(), req.refId()), senderOf(sender));
        wsPublisher.publish(WsRoute.user(req.username(), WsDestinations.QUEUE_NOTIFICATIONS), message);

        auditLogService.record(AuditEventType.NOTIFICATION_SEND, AuditResult.SUCCESS, sender.getUsername(),
                req.username(), req.title());
        return message.id();
    }

    /**
     * 인증 도메인의 세션 종료 → 해당 사용자의 WebSocket 세션(유지할 jti 제외)에 알리고 연결 종료.
     * 알림 실패(Redis 장애)가 로그인·로그아웃 자체를 막지 않도록 예외를 삼킨다 (남은 소켓은 주기 검사가 정리).
     */
    @EventListener
    public void onSessionTerminated(SessionTerminatedEvent event) {
        try {
            wsPublisher.publish(WsRoute.sessionControl(event.userId(), event.keepJti()),
                    sessionTerminatedMessage(event.reason()));
        } catch (RuntimeException e) {
            log.warn("세션 종료 WebSocket 알림 실패 - userId: {}, reason: {}, cause: {}",
                    event.userId(), event.reason(), e.getMessage());
        }
    }

    public static WsMessage<SessionTerminatedPayload> sessionTerminatedMessage(SessionTerminateReason reason) {
        WsLevel level = switch (reason) {
            case LOGOUT -> WsLevel.INFO;
            case EXPIRED -> WsLevel.WARN;
            default -> WsLevel.ERROR;
        };
        return WsMessage.of(WsMessageType.SESSION_TERMINATED, level, reason.getTitle(), reason.getMessage(),
                SessionTerminatedPayload.of(reason), WsSender.SYSTEM);
    }

    private static WsLevel levelOrInfo(WsLevel level) {
        return level != null ? level : WsLevel.INFO;
    }

    private static WsSender senderOf(UserPrincipal principal) {
        return new WsSender(principal.getUsername(), principal.getName());
    }
}
