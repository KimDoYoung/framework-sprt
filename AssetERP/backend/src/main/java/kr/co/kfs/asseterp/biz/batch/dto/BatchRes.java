package kr.co.kfs.asseterp.biz.batch.dto;

/** 배치 실행 결과 — message는 AS-IS가 응답 본문에 한 줄로 쓰던 결과 문구 */
public record BatchRes(String actionCode, String message) {
}
