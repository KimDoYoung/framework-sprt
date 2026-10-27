package kr.co.kfs.asseterp.biz.ast.dto;

public record AstClassTreeSaveReq(
        Long classTreeId,
        Long parentTreeId,
        String classTreeName,
        String classTreeCode,
        Long seq,
        String typeCode,
        String isin,
        String note,
        String useYn,
        String assetType
) {
}
