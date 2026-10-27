package kr.co.kfs.asseterp.biz.ast.dto;

public record AstManagerSaveReq(
        Long managerId,
        Long linkId,
        String managerType,
        Long orgId,
        Long personId,
        String reprYn,
        String linkContent
) {
}
