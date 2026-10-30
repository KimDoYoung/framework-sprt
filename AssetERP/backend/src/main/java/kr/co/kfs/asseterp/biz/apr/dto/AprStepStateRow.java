package kr.co.kfs.asseterp.biz.apr.dto;

/** 결재선의 단계·상태 (문서 상태를 다시 정하는 데 쓴다, V02) */
public record AprStepStateRow(String stepTypeCode, String stepStatusCode) {
}
