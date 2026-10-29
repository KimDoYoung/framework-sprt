package kr.co.kfs.asseterp.biz.ast.dto;

/** 계좌선택 조회창 한 행(Ast01_Lookup_CorpAccount) — Ast01_ClassTreeModel 중 계좌구분·보관처·계좌 */
public record CorpAccountRes(Long classTreeId, String itemSClassName, String corpName, String classTreeName, String corpAccountName) {
}
