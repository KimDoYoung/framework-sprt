package kr.co.kfs.asseterp.biz.ast.dto;

public record AstClassTreeItemRes(
        Long classTreeId,
        Long companyId,
        Long parentTreeId,
        Long seq,
        String isin,
        String classTreeName,
        String classTreeCode,
        String useYn,
        String note,
        String itemClassName
) {
}
