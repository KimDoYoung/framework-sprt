package kr.co.kfs.asseterp.biz.dcr.dto;

/** 조직별 저장의 바뀐 문서분류 한 행 */
public record DcrOrgAuthByOrgRow(Long classTreeId, String retrieveYn, String updateYn) {
}
