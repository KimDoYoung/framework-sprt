package kr.co.kfs.asseterp.biz.org.dto;

/** 바뀐 조직 권한 한 행 — orgAuthId가 없으면 새 권한 행 */
public record OrgFundAuthRow(Long orgAuthId, Long orgCodeId, String authYn) {
}
