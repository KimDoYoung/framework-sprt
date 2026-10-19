package kr.co.kfs.asseterp.biz.ast.dto;

/** 종목별 문서검색 왼쪽 트리 한 노드(Apr01_Tab_ItemDocument). typeCode IT면 종목(이름 뒤에 표준코드), 그 밖은 분류 */
public record AstItemTreeRes(Long classTreeId, Long parentTreeId, String classTreeName, String typeCode, Integer depth) {
}
