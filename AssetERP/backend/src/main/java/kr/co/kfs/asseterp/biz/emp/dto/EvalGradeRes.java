package kr.co.kfs.asseterp.biz.emp.dto;

/** 평가등급 한 행 — 화면 그리드 열 순서(평가등급 · 등급가중치 · 등급기준점수 · 이상/미만 · 평정사유 필수). 평정사유 필수는 'true'/'false' */
public record EvalGradeRes(Long evalGradeId, Long evalListStdId, String grade, Double gradeWeight, Long gradeScore,
                           String compareCode, String compareName, String reasonYn) {
}
