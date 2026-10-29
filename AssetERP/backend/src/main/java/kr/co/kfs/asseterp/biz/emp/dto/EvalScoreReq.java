package kr.co.kfs.asseterp.biz.emp.dto;

/** 추가가감 저장 (AS-IS Emp43_Edit_Score — 상점·벌점·평정사유가감). 빈 칸은 null */
public record EvalScoreReq(Long plusScore, Long minusScore, Long reasonAdjustScore) {
}
