package kr.co.kfs.asseterp.biz.emp.dto;

/** 인사평가표 한 행 (AS-IS emp44_eval_write.getEvalTargetList — Emp44_Lookup_Write 그리드). 평가 안 한 항목은 evalGrade 등이 null */
public record EvalWriteRes(
        Long evalWriteId,
        Long evalListId,
        String evalClassNm,
        String content,
        Long weightMember,
        Long weightLeader,
        String evalGrade,
        Long evalGradeId,
        Double evalGradeScore
) {
}
