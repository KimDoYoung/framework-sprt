package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 결재선 한 줄 (apr.Apr04_ApprStep.selectByApprId + 서버가 만드는 stepApprName HTML, V01) */
public record AprApprStepRes(Long apprStepId, String seq, String stepTypeCode, String stepTypeName, String stepStatusCode, String stepStatusName,
                             LocalDateTime apprDate, String stepApprName, String opinionYnStr, String typoYnStr, String note,
                             String rejectReason, Long stepEmpId, Long apprEmpId) {
}
