package com.asseterp.security.biz.push.dto;

/**
 * NOTIFICATION 메시지 payload
 *
 * @param link  클릭 시 이동할 화면 경로 (없으면 null)
 * @param refId 관련 업무 데이터 ID (예: 결재 문서 번호, 없으면 null)
 */
public record NotificationPayload(String link, String refId) {
}
