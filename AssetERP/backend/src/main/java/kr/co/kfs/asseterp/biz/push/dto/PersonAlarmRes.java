package kr.co.kfs.asseterp.biz.push.dto;

import java.util.List;

/** 사원 알림 발송 결과 (EE51) — 접속 중이라 보낸 사원 / 오프라인이라 못 보낸 사원 */
public record PersonAlarmRes(List<Long> sentPersonIds, List<Long> offlinePersonIds) {
}
