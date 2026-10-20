package kr.co.kfs.asseterp.biz.ics.dto;

/** ics04_share INSERT/UPDATE 한 행 (id는 f_create_seq) */
public record IcsShareRow(Long shareId, Long companyId, Long managerId, String shareCode, Long orgId) {
}
