package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** selectSteps 한 줄 — 이름 문구(stepApprName)를 만들기 전의 원료 (V01) */
public record AprApprStepRow(Long apprStepId, String seq, String stepTypeCode, String stepTypeName, String stepStatusCode, String stepStatusName,
                             LocalDateTime apprDate, Long stepEmpId, Long apprEmpId, String note, String rejectReason, String opinionYnStr,
                             String typoYnStr, Long orgCodeId, String titleName, String korName, String orgTitleName) {
}
