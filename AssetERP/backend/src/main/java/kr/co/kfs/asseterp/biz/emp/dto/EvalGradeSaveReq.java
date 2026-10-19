package kr.co.kfs.asseterp.biz.emp.dto;

import java.util.List;

/** 평가등급 저장 (AS-IS emp.Emp42_EvalGrade.updateList) — 화면의 모든 행과 삭제대기 ID를 한 번에 보낸다 */
public record EvalGradeSaveReq(Long evalListStdId, List<Row> rows, List<Long> deleteIds) {

    /** evalGradeId가 없거나 0 이하면 새 행 */
    public record Row(Long evalGradeId, String grade, Double gradeWeight, Long gradeScore, String compareCode, String reasonYn) {
    }
}
