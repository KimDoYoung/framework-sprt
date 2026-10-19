package kr.co.kfs.asseterp.biz.ast.dto;

/** ast01_class_tree.selectByCompanyId 조건. companyId·userId·orgId는 로그인 사용자, assetType은 LIKE 패턴(1 고유자산·2 운용자산·% 전체) */
public record AstItemTreeCond(Long companyId, Long userId, Long orgId, String typeCode, String assetType) {
}
