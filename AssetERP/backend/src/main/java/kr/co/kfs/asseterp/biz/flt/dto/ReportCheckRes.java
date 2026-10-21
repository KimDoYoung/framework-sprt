package kr.co.kfs.asseterp.biz.flt.dto;

/** 정기보고서 작성 전 점검 결과 (AS-IS Flt10_Tr.checkPreAppr → checkNextAppr) — ok=false면 message를 보여 주고 멈춘다 */
public record ReportCheckRes(Boolean ok, String message) {
}
