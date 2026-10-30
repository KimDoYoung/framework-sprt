package kr.co.kfs.asseterp.biz.apr.dto;

/** [상신취소] — 특정 화면에서 상신된 문서(linkCode)는 즉시 폐기되므로 확인을 받은 뒤(confirmed=true) 다시 보낸다 (V02) */
public record AprApprCancelReq(boolean confirmed) {
}
