package kr.co.kfs.asseterp.biz.dcr.dto;

/**
 * 새 메일 시스템 쓰기창 요청 — AS-IS new AssetMailSend(apprId, email, title, content).
 * header·content는 사용료 청구(erpFeeChargeOpen)만 넣고, 문서·증명서는 원본처럼 비어 있다.
 */
public record DcrAssetMailReq(Long apprId, String header, String content) {
}
