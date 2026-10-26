package kr.co.kfs.asseterp.biz.ast.dto;

/** 자산(종목) 목록 한 행 (P10 자산별 펀드 조회, AS-IS Ast01_ClassTreeModel 중 종목코드·종목명(전체경로)) */
public record AstAssetItemRes(Long classTreeId, String isin, String classTreeFullName) {
}
