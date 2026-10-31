package kr.co.kfs.asseterp.biz.apr.dto;

/** [문서폐기 신청] 누르면 하는 확인 (AS-IS Apr90_DisposalList.checkDisposal — 안 되면 ok=false + 문구) */
public record AprDisposalCheckRes(boolean ok, String message) {
}
