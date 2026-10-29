package kr.co.kfs.asseterp.biz.emp.dto;

/** 대표이사 가감 저장 (AS-IS Emp43_Edit_CeoScore — 가점·감점). 빈 칸은 null */
public record EvalCeoScoreReq(Long ceoEvalBonus, Long ceoEvalPenalty) {
}
