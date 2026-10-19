package kr.co.kfs.asseterp.biz.act.dto;

/** 대표계정코드 한 행 (AS-IS act10_repr_account.selectByCompanyId) — 계정속성명·상대 대표계정명은 SQL 계산 열 */
public record ReprAccountRes(Long reprAccountId, Long companyId, String reprAccountCode, String reprAccountName,
                             String attributeCode, String attributeName, String tgtReprAccountCode,
                             String tgtReprAccountName, String note) {
}
