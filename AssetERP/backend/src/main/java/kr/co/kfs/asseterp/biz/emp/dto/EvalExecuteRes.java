package kr.co.kfs.asseterp.biz.emp.dto;

/**
 * 인사평가수행 목록 한 행 (AS-IS emp43_eval_target.selectByText — Emp43_Tab_EvalExecute 그리드, 인사평가표 창 Emp44_Lookup_Write가 같이 쓴다).
 * 로그인 사원이 평가자인 대상자이고 orderEvalNm은 '1차'(내가 1차 평가자)·'2차'. orderScore는 원본 모델처럼 글자
 */
public record EvalExecuteRes(
        Long evalTargetId,
        Long evalListStdId,
        String stdYear,
        String stdTermCd,
        Long personId,
        String orderEvalNm,
        String orgHeadNm,
        String posNm,
        String personNm,
        String orgNm,
        String hireDateStr,
        String workYear,
        String dateStr,
        String orderScore,
        String orderGrade,
        String orderStatus,
        String orderReason,
        String firstEvalReason,
        String secondEvalReason
) {
}
