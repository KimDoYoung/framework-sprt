package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** [저장] — 그리드에서 고치는 열(신청상태·완료일·비고·반려사유)만 */
public record FloralRequestStatusReq(Long floralRequestId, String statusCode, LocalDate endDate, String note, String rejectReason) {
}
