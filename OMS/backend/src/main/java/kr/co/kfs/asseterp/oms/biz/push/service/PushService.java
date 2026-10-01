package kr.co.kfs.asseterp.oms.biz.push.service;

import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditEventType;
import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditResult;
import kr.co.kfs.asseterp.oms.biz.audit.service.AuditLogService;
import kr.co.kfs.asseterp.oms.biz.auth.dto.SessionTerminateReason;
import kr.co.kfs.asseterp.oms.biz.auth.dto.SessionTerminatedEvent;
import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.biz.push.dto.NoticeReq;
import kr.co.kfs.asseterp.oms.biz.push.dto.NotificationPayload;
import kr.co.kfs.asseterp.oms.biz.push.dto.NotificationReq;
import kr.co.kfs.asseterp.oms.biz.push.dto.SessionTerminatedPayload;
import kr.co.kfs.asseterp.oms.biz.user.mapper.AccountMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import kr.co.kfs.asseterp.oms.common.websocket.WsDestinations;
import kr.co.kfs.asseterp.oms.common.websocket.WsPublisher;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsLevel;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsMessage;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsMessageType;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsRoute;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsSender;
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
    private final AccountMapper accountMapper;
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
     * 받는 사람은 보내는 사람과 같은 회사의 로그인 ID이다. WebSocket 사용자 이름은 {회사코드}:{로그인ID}.
     *
     * @return 발송한 메시지 ID
     */
    public String createNotification(NotificationReq req, UserPrincipal sender) {
        String companyCode = sender.getCompanyCode();
        String loginId = req.username();
        if (accountMapper.findEmployee(companyCode, loginId).isEmpty()
                && accountMapper.findManager(companyCode, loginId).isEmpty()) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        String receiver = companyCode + ":" + loginId;
        WsMessage<NotificationPayload> message = WsMessage.of(WsMessageType.NOTIFICATION, levelOrInfo(req.level()),
                req.title(), req.message(), new NotificationPayload(req.link(), req.refId()), senderOf(sender));
        wsPublisher.publish(WsRoute.user(receiver, WsDestinations.QUEUE_NOTIFICATIONS), message);

        auditLogService.record(AuditEventType.NOTIFICATION_SEND, AuditResult.SUCCESS, sender.getUsername(),
                receiver, req.title());
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
