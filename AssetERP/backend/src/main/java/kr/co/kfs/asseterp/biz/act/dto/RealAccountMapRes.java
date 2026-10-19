package kr.co.kfs.asseterp.biz.act.dto;

public record RealAccountMapRes(
        Long realAccountMapId,
        Long companyId,
        String reprAccountCode,
        String reprAccountName,
        String accountMap,
        String realAccountCode,
        String realAccountName,
        String note
) {
}
