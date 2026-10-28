package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 인사평가 대상자 저장 행 (AS-IS Emp43_EvalTargetModel 중 화면이 넣는 값). evalTargetId ≤ 0이면 신규 */
public record EvalTargetRow(
        Long evalTargetId,
        Long personId,
        String stdYear,
        String stdTermCd,
        Long evalListStdId,
        LocalDate evalStartDate,
        LocalDate evalCloseDate,
        Long firstEvaluatorId,
        Long firstEvalWeight,
        Long secondEvaluatorId,
        Long secondEvalWeight
) {
}
