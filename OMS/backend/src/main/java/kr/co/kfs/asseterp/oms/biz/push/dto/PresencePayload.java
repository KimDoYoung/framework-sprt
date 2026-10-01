package kr.co.kfs.asseterp.oms.biz.push.dto;

/**
 * PRESENCE_CHANGED 메시지 payload
 *
 * @param event   JOIN(연결) / LEAVE(종료)
 * @param session 변경된 세션
 * @param count   변경 후 전체 접속 세션 수
 */
public record PresencePayload(Event event, PresenceItemRes session, int count) {

    public enum Event {
        JOIN,
        LEAVE
    }
}
