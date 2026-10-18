package kr.co.kfs.asseterp.biz.ast.dto;

/** 자산상세 항목 한 행 — 화면 그리드 열(조회순번·항목·연관태그·사용여부). useYn은 DB 형태('true'/'false') */
public record AstDetailRes(Long detailId, Long seq, String title, String tag, String useYn) {
}
