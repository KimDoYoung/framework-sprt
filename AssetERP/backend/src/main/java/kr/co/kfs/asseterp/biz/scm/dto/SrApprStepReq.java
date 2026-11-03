package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDateTime;

/** AS-IS Scm02_SrApprStep.updateList 에 넘기는 결재단계 한 줄. srApprStepId가 0 이하면 새 줄(서버가 번호를 받는다) */
public record SrApprStepReq(Long srApprStepId, String stepTypeCd, String seq, String stepStatusCd, LocalDateTime apprDate,
                            String note, String rejectReason, Long stepEmpId, Long apprEmpId) {
}
