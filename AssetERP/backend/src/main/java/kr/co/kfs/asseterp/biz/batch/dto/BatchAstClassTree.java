package kr.co.kfs.asseterp.biz.batch.dto;

/** ast01_class_tree 한 건 (AS-IS Ast01_ClassTreeModel 중 assetErpItemInsert가 채우는 필드) */
public record BatchAstClassTree(
        Long classTreeId,
        Long companyId,
        String classTreeCode,
        String classTreeName,
        Long parentTreeId,
        Long seq,
        String typeCode,
        String useYn,
        String isin,
        String itemLClassCode,
        String itemMClassCode,
        String itemSClassCode,
        String assetType,
        String icamYn
) {
}
