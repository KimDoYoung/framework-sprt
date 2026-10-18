package kr.co.kfs.asseterp.biz.dcr.dto;

/** updateCheck에 보내는 행 (AS-IS 변경된 Dcr01_ClassTreeModel) — 관리자 문서분류 고정값 비교와 구분코드 중복 검사용 */
public record DcrCheckRowReq(Long classTreeId, String classTreeCode, String classTreeName, String seq, String note) {
}
