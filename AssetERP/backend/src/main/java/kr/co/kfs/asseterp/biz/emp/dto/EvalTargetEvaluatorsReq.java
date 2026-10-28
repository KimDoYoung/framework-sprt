package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** AS-IS Emp43_EvalTarget.updateEval — 고른 대상자들의 평가자를 한꺼번에 바꾼다 (2차는 둘 다 null 가능) */
public record EvalTargetEvaluatorsReq(
        List<Long> evalTargetIds,
        Long firstPersonId,
        Long firstEvalWeight,
        Long secondPersonId,
        Long secondEvalWeight
) {
}
