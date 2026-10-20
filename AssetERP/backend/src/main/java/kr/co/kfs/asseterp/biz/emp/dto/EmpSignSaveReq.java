package kr.co.kfs.asseterp.biz.emp.dto;

/** 결재서명 저장 한 행 (G09) — 화면이 바꾸는 열만. signId가 없거나 0 이하면 새 행 */
public record EmpSignSaveReq(Long signId, String useYn, String note) {
}
