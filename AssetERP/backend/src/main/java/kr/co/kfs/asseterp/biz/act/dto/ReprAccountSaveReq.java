package kr.co.kfs.asseterp.biz.act.dto;

/** 대표계정코드 저장 한 행 (AS-IS act.Act10_ReprAccount.update) — reprAccountId가 없거나 0 이하면 새 행 */
public record ReprAccountSaveReq(Long reprAccountId, String reprAccountCode, String reprAccountName, String attributeCode,
                                 String tgtReprAccountCode, String note) {
}
