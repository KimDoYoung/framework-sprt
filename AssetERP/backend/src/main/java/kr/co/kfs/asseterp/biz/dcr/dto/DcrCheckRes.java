package kr.co.kfs.asseterp.biz.dcr.dto;

/**
 * 서버 점검 결과 (AS-IS ServiceResult status·message).
 * updateCheck: status 1 = 통과, -1 = message가 안내 문구.
 * deleteCheck: status = 문서분류지정+상신문서 건수(0이면 지워도 됨), message = "continue"(상신문서만) 또는 건수 문구
 */
public record DcrCheckRes(int status, String message) {
}
