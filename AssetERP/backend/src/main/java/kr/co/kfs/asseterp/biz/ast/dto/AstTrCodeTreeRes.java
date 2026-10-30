package kr.co.kfs.asseterp.biz.ast.dto;

/** AS-IS ast.Ast01_ClassTree.selectByTrCode — 종목선택 창(Ast01_Lookup_Info)의 트리. 전위 순서 평평한 목록 + depth */
public record AstTrCodeTreeRes(
        Long classTreeId,
        Long parentTreeId,
        String classTreeName,
        String typeCode,
        Integer depth,
        String classTreeFullName,
        String curCode,
        Long trUnit
) {
}
