package kr.co.kfs.asseterp.biz.emp.dto;

/**
 * 인사평가 상신문서 연결 한 행 (AS-IS emp45_eval_relate_appr.selectByTermCode — Emp43_Tab_FirstAppr·Emp43_Tab_FinalAppr).
 * apprId·apprStatus* 는 1차 보고 상신문서, finalApprId·finalApprStatus* 는 최종(대표이사) 보고 상신문서. 상신 전이면 상태가 null
 */
public record EvalRelateApprRes(
        Long evalRelateApprId,
        Long apprId,
        Long finalApprId,
        String apprStatusCode,
        String apprStatusName,
        String finalApprStatusCode,
        String finalApprStatusName) {
}
