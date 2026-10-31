package kr.co.kfs.asseterp.biz.apr.dto;

/** [저장]·[결재요청]·[삭제] 결과. ok가 false면 message를 안내로 보여 준다(AS-IS SimpleMessage). makePdf는 V04 전까지 만들지 않는다 */
public record AprApprWriteRes(boolean ok, String message, Long apprId, String statusCode, boolean makePdf, String notice) {
}
