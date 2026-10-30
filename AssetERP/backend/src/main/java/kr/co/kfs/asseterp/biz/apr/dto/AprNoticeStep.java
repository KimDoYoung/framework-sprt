package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 알림 대상을 고르는 결재선 한 줄 (apr04_appr_step, AA01) */
public record AprNoticeStep(Long apprId, String seq, String stepTypeCode, String stepStatusCode, Long stepEmpId, LocalDateTime apprDate) {
}
