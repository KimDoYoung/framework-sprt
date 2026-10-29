package kr.co.kfs.asseterp.biz.emp.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 인사평가결과(인사부)·인사평가보고(대표이사) 목록 한 행 (AS-IS emp43_eval_target.selectByTextAdmin — Emp43_Tab_FirstAppr·Emp43_Tab_FinalAppr).
 * 세 화면(T03·T04·T05 Emp43_Tab_EvalResult)이 같은 SQL 계열을 쓰고 화면마다 보이는 열이 다르다. *OrderReason 은 '작성필요'·'작성완료'·'' 글자
 */
public record EvalAdminRes(
        Long evalTargetId,
        Long personId,
        String orgNm,
        String personNm,
        String posNm,
        String orgHeadNm,
        String firstPersonNm,
        BigDecimal firstEvalScore,
        String firstEvalGrade,
        String firstOrderReason,
        String firstEvalReason,
        String secondPersonNm,
        BigDecimal secondEvalScore,
        String secondEvalGrade,
        String secondOrderReason,
        String secondEvalReason,
        BigDecimal totalEvalScore,
        String totalEvalGrade,
        String totalEvalStatus,
        String totalOrderReason,
        Long plusScore,
        Long minusScore,
        Long reasonAdjustScore,
        BigDecimal adjustEvalScore,
        String adjustEvalGrade,
        String apprStatus,
        Long ceoEvalBonus,
        Long ceoEvalPenalty,
        BigDecimal finalEvalScore,
        String finalEvalGrade,
        String titleNm,
        LocalDate evalStartDate,
        LocalDate evalCloseDate) {
}
