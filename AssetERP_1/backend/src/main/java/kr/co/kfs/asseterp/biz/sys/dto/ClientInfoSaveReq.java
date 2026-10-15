package kr.co.kfs.asseterp.biz.sys.dto;

/** Sys85_Lookup_ClientInfoList 저장 한 행 (clientInfoId ≤ 0·null이면 새 행) */
public record ClientInfoSaveReq(Long clientInfoId, String companyName, String orgName, String posName, String clientName, String moblieTelno) {
}
