package com.asseterp.security.common.websocket.dto;

import com.asseterp.security.common.log.MdcKeys;
import com.asseterp.security.common.log.MdcLoggingFilter;
import org.slf4j.MDC;

import java.time.Instant;
import java.util.UUID;

/**
 * 서버 → 클라이언트 WebSocket 메시지 공통 envelope. 모든 목적지(/user/queue/*, /topic/*)와 STOMP ERROR 본문이 이 형식을 따른다.
 * 식별자·시각·추적ID·분류가 빠지지 않도록 생성은 {@link #of}로만 한다.
 *
 * @param id       메시지 ID (UUID, 클라이언트 중복 제거용)
 * @param type     메시지 유형 (payload 구조를 결정)
 * @param category 분류 (type에서 결정됨)
 * @param level    중요도
 * @param title    제목
 * @param message  본문 (사람이 읽는 문장)
 * @param payload  유형별 구조화 데이터 (없으면 null)
 * @param sender   발신자
 * @param sentAt   발송 시각
 * @param traceId  메시지를 발생시킨 요청의 추적ID (서버 로그 검색 키)
 */
public record WsMessage<T>(
        String id,
        WsMessageType type,
        WsCategory category,
        WsLevel level,
        String title,
        String message,
        T payload,
        WsSender sender,
        Instant sentAt,
        String traceId
) {

    public static <T> WsMessage<T> of(WsMessageType type, WsLevel level, String title, String message,
                                      T payload, WsSender sender) {
        String traceId = MDC.get(MdcKeys.TRACE_ID);
        return new WsMessage<>(
                UUID.randomUUID().toString(),
                type,
                type.getCategory(),
                level,
                title,
                message,
                payload,
                sender != null ? sender : WsSender.SYSTEM,
                Instant.now(),
                traceId != null ? traceId : MdcLoggingFilter.newTraceId());
    }
}
