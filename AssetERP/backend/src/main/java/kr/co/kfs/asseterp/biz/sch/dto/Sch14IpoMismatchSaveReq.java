package kr.co.kfs.asseterp.biz.sch.dto;

/** 공모주일정 미일치내역 저장 (Sch14_Lookup_IpoMismatch.update) — 화면에서 바꾸는 것은 확인완료뿐 */
public record Sch14IpoMismatchSaveReq(Long ipoMismatchId, String checkYn) {
}
