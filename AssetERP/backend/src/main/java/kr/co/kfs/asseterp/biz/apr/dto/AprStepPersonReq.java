package kr.co.kfs.asseterp.biz.apr.dto;

/** 결재선에 넣을 사원 (조회한 행의 사원·조직, V07) */
public record AprStepPersonReq(Long personId, Long orgCodeId) {
}
