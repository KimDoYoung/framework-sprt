package kr.co.kfs.asseterp.biz.ast.dto;

public record AstManagerRes(
        Long managerId,
        Long companyId,
        Long linkId,
        String managerType,
        String managerName,
        Long orgId,
        String orgName,
        Long personId,
        String personName,
        String reprYn,
        String linkContent
) {
}
