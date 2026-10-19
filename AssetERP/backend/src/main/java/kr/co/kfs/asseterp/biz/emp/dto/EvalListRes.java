package kr.co.kfs.asseterp.biz.emp.dto;

/** 인사평가 항목 한 행 — 화면 그리드 열 순서(평가항목 · 내용 · 조직원 · 조직장 · 조회순번) */
public record EvalListRes(Long evalListId, Long evalListStdId, String evalClassCode, String evalClassName, String content,
                          Long weightMember, Long weightLeader, Long seq) {
}
