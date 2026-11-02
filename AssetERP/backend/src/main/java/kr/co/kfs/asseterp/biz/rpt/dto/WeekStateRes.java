package kr.co.kfs.asseterp.biz.rpt.dto;

/** 한 주의 제출·확인 상태 (AS-IS fixCheck·confirmCheck·confirmRetrieve) — confirmerId가 있으면 확인 처리된 보고 */
public record WeekStateRes(boolean fixYn, Long confirmerId, String confirmerName) {
}
