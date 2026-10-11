package kr.co.kfs.asseterp.biz.emp.dto;

/** 고과(평가)내역 행 (AS-IS Emp09_EvaluationModel) */
public record EvaluationRes(
        Long evaluationId,
        Long personId,
        String evaluationDt,
        String evaluationOrg,
        String evaluationEmp,
        String evaluationGrade,
        String evaluationDesc,
        String note
) {}
