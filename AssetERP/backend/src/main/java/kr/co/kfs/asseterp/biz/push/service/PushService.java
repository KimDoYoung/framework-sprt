package kr.co.kfs.asseterp.biz.push.service;

import kr.co.kfs.asseterp.biz.audit.dto.AuditEventType;
import kr.co.kfs.asseterp.biz.audit.dto.AuditResult;
import kr.co.kfs.asseterp.biz.audit.service.AuditLogService;
import kr.co.kfs.asseterp.biz.auth.dto.SessionTerminateReason;
import kr.co.kfs.asseterp.biz.auth.dto.SessionTerminatedEvent;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.push.dto.NoticeReq;
import kr.co.kfs.asseterp.biz.push.dto.NotificationPayload;
import kr.co.kfs.asseterp.biz.push.dto.NotificationReq;
import kr.co.kfs.asseterp.biz.push.dto.PersonAlarmRes;
import kr.co.kfs.asseterp.biz.push.dto.PresenceItemRes;
import kr.co.kfs.asseterp.biz.push.dto.SessionTerminatedPayload;
import kr.co.kfs.asseterp.biz.user.mapper.AccountMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.websocket.WsDestinations;
import kr.co.kfs.asseterp.common.websocket.WsPublisher;
import kr.co.kfs.asseterp.common.websocket.dto.WsLevel;
import kr.co.kfs.asseterp.common.websocket.dto.WsMessage;
import kr.co.kfs.asseterp.common.websocket.dto.WsMessageType;
import kr.co.kfs.asseterp.common.websocket.dto.WsRoute;
import kr.co.kfs.asseterp.common.websocket.dto.WsSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

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
    private final PresenceService presenceService;

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
     * 받는 사람은 보내는 사람과 같은 회사의 로그인 ID이다 (KFS 관리자는 req.companyCode로 다른 회사 지정). WebSocket 사용자 이름은 {회사코드}:{로그인ID}.
     *
     * @return 발송한 메시지 ID
     */
    public String createNotification(NotificationReq req, UserPrincipal sender) {
        String companyCode = sender.isSysAdmin() && req.companyCode() != null && !req.companyCode().isBlank()
                ? req.companyCode() : sender.getCompanyCode();
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
     * 사원 알림 (EE51, AS-IS Emp00_Lookup_SendMessage.sendMessage). personIds 중 같은 회사에서 지금 접속한 사원에게만
     * /user/queue/notifications 로 보내고, 접속하지 않은 사원은 offline으로 돌려준다(저장하지 않음).
     */
    public PersonAlarmRes sendToPersons(UserPrincipal sender, List<Long> personIds, String text) {
        String companyPrefix = sender.getCompanyCode() + ":";
        List<PresenceItemRes> presence = presenceService.searchPresence().stream()
                .filter(p -> p.username() != null && p.username().startsWith(companyPrefix))
                .toList();
        String message = "['" + sender.getName() + "'님이 보낸 메세지입니다.]\r\n" + text;
        List<Long> sent = new ArrayList<>();
        List<Long> offline = new ArrayList<>();
        Set<String> receivers = new LinkedHashSet<>();
        for (Long personId : personIds) {
            List<PresenceItemRes> mine = presence.stream().filter(p -> personId.equals(p.userId())).toList();
            if (mine.isEmpty()) {
                offline.add(personId);
            } else {
                sent.add(personId);
                mine.forEach(p -> receivers.add(p.username()));
            }
        }
        for (String receiver : receivers) {
            WsMessage<NotificationPayload> msg = WsMessage.of(WsMessageType.NOTIFICATION, WsLevel.INFO, "알림", message,
                    new NotificationPayload(null, null), senderOf(sender));
            wsPublisher.publish(WsRoute.user(receiver, WsDestinations.QUEUE_NOTIFICATIONS), msg);
        }
        auditLogService.record(AuditEventType.NOTIFICATION_SEND, AuditResult.SUCCESS, sender.getUsername(),
                sent.size() + "명", "알림발송");
        return new PersonAlarmRes(sent, offline);
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
