package kr.co.kfs.asseterp.biz.emp.dto;

/** AS-IS Emp43_EvalTarget.updateEndYn — 평가완료(true)·평가취소(false) */
public record EvalEndReq(boolean endYn, String orderEvalName) {
}
