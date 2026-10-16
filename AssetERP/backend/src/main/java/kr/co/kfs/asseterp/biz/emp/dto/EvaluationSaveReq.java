package kr.co.kfs.asseterp.biz.emp.dto;

/** 고과(평가)내역 저장 요청 */
public record EvaluationSaveReq(
        Long evaluationId,
        Long personId,
        String evaluationDt,
        String evaluationOrg,
        String evaluationEmp,
        String evaluationGrade,
        String evaluationDesc,
        String note
) {}
