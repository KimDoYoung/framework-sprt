package kr.co.kfs.asseterp.biz.flt.dto;

/** 추가확인사유 저장 전 확인용 — 거래의 사원과 거래일(AS-IS Flt10_Tr.update의 최초원장 기준일 검사) */
public record TrReasonKeyRes(Long personId, String trDate) {
}
