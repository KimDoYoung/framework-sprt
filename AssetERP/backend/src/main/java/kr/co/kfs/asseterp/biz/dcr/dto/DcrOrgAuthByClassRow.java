package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서분류별 저장의 바뀐 조직 한 행 */
public record DcrOrgAuthByClassRow(Long orgCodeId, String retrieveYn, String updateYn) {
}
