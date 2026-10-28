package kr.co.kfs.asseterp.biz.emp.dto;

/** AS-IS Emp44_EvalWrite.updateEvalGradeId — 평가 항목 하나의 등급 선택 (평가자·회사는 서버가 로그인 값으로) */
public record EvalWriteGradeReq(Long evalTargetId, Long evalListId, Long evalGradeId, boolean orgHead) {
}
