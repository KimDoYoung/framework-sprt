package kr.co.kfs.asseterp.biz.flt.dto;

/** 등록·저장·삭제·엑셀업로드 전 점검 결과 (AS-IS Flt13_Lookup_BookInit.checkPreTr). ok=false면 message를 알리고, revert=true면 잔고기준일을 원래 값으로 되돌린다 */
public record BookInitCheckRes(boolean ok, String message, boolean revert) {
}
