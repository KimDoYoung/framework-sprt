package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDateTime;

/** 의뢰 결재단계 한 줄 (scm02_sr_appr_step.selectBySrId, EE15) — seq는 문자열('10','20'…) */
public record SrApprStepRes(Long srApprStepId, Long srId, String stepTypeCd, String seq, String stepStatusCd, LocalDateTime apprDate,
                            String note, String rejectReason, Long stepEmpId, Long apprEmpId, String stepTypeNm, String stepStatusNm,
                            String stepApprName, String orgKorNm, String titleNm, String empKorNm) {
}
