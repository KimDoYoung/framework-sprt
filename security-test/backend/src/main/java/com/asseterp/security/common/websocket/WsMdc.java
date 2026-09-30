package com.asseterp.security.common.websocket;

import com.asseterp.security.common.log.MdcKeys;
import com.asseterp.security.common.log.MdcLoggingFilter;
import com.asseterp.security.common.websocket.dto.WsUser;
import org.slf4j.MDC;

/**
 * WebSocket 프레임은 MdcLoggingFilter를 거치지 않으므로, 프레임·이벤트 처리 스레드에서 MDC를 직접 채운다.
 * 호출한 쪽이 처리 후 {@link MDC#clear()}로 정리한다.
 */
public final class WsMdc {

    private WsMdc() {
    }

    /**
     * @param traceId 이어받을 추적ID (없으면 새로 발급)
     */
    public static void put(WsUser user, String traceId) {
        MDC.put(MdcKeys.TRACE_ID, traceId != null ? traceId : MdcLoggingFilter.newTraceId());
        if (user != null) {
            MDC.put(MdcKeys.USER_ID, user.username());
            if (user.clientIp() != null) {
                MDC.put(MdcKeys.CLIENT_IP, user.clientIp());
            }
        }
    }
}
