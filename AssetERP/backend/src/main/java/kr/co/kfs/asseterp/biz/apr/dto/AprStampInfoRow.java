package kr.co.kfs.asseterp.biz.apr.dto;

/** 인감 한 건 (AS-IS apr10_stamp.selectById 중 문서창이 쓰는 열: 이름·이미지 ID·인감책임자·인감합의 여부·부책임자) */
public record AprStampInfoRow(Long stampId, String stampName, String stampIdString, Long aprEmpId, Long orgId, String stepUseYn, Long secondEmpId) {
}
