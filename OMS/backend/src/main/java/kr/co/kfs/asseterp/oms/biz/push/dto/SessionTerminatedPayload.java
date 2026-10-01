package kr.co.kfs.asseterp.oms.biz.push.dto;

import kr.co.kfs.asseterp.oms.biz.auth.dto.SessionTerminateReason;

/**
 * SESSION_TERMINATED 메시지 payload
 *
 * @param reason    종료 사유 (프론트엔드 SessionTerminateReason과 같은 이름)
 * @param errorCode 대응하는 ErrorCode 이름 (없으면 null)
 */
public record SessionTerminatedPayload(SessionTerminateReason reason, String errorCode) {

    public static SessionTerminatedPayload of(SessionTerminateReason reason) {
        return new SessionTerminatedPayload(reason, reason.getErrorCode() != null ? reason.getErrorCode().name() : null);
    }
}
