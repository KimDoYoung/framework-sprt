package kr.co.kfs.asseterp.biz.emp.dto;

/** AS-IS Emp43_EvalTarget.updateReason — orderEvalName '1차'면 1차 평정사유, 아니면 2차 */
public record EvalReasonReq(String reason, String orderEvalName) {
}
