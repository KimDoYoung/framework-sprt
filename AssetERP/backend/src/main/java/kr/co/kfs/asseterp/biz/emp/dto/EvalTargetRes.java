package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/**
 * 인사평가 대상자 한 행 (AS-IS emp43_eval_target.selectByTermCode — Emp43_Tab_EvalTarget 그리드).
 * 평가자 ID·비중은 셀 편집 값, 진행상태(status)는 '진행중'·'상신중'·'완료'·''.
 */
public record EvalTargetRes(
        Long evalTargetId,
        Long companyId,
        Long personId,
        String stdYear,
        String stdTermCd,
        Long evalListStdId,
        LocalDate evalStartDate,
        LocalDate evalCloseDate,
        String orgHeadNm,
        String posNm,
        String personNm,
        String orgNm,
        Long firstEvaluatorId,
        String firstOrgNm,
        String firstPersonNm,
        Long firstEvalWeight,
        Long secondEvaluatorId,
        String secondOrgNm,
        String secondPersonNm,
        Long secondEvalWeight,
        Long sumEvalWeight,
        String status
) {
}
