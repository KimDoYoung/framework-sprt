package kr.co.kfs.asseterp.biz.act.dto;

public record RealAccountMapSaveReq(
        Long realAccountMapId,
        String reprAccountCode,
        String accountMap,
        String realAccountCode,
        String note
) {
}
