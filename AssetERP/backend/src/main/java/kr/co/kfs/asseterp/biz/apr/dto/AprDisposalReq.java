package kr.co.kfs.asseterp.biz.apr.dto;

/** 문서폐기 신청서 제출 (AS-IS Apr90_DisposalList.modelUpdate) */
public record AprDisposalReq(String reason, Long confirmEmpId) {
}
