package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** AS-IS Emp43_EvalTarget.deleteList — 화면에 보이는(고친) 평가자 값을 함께 보낸다 */
public record EvalTargetDeleteReq(List<Row> rows) {
    public record Row(Long evalTargetId, Long firstEvaluatorId, Long secondEvaluatorId) {
    }
}
