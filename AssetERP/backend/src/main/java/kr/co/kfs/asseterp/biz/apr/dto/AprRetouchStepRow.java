package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 결재선 수정 때 DB에 있는 결재선 한 줄 (apr04_appr_step, V08) */
public record AprRetouchStepRow(Long apprStepId, String seq, String stepTypeCode, String stepStatusCode, Long stepEmpId, String lockYn,
                                Long addEmpId, LocalDateTime apprDate) {
}
