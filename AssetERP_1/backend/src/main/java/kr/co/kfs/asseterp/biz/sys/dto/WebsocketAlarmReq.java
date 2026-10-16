package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/** 알림 전송 — personIds가 비어 있으면 전체 */
public record WebsocketAlarmReq(List<Long> personIds, String message) {
}
