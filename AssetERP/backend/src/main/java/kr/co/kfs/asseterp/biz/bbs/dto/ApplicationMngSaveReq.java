package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** [저장] — 그리드에서 고치는 열(신청상태·완료일·비고)만 */
public record ApplicationMngSaveReq(Long applicationId, String appStatus, LocalDate closeDate, String note) {
}
