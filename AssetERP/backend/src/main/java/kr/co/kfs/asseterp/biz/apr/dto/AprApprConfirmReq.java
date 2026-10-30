package kr.co.kfs.asseterp.biz.apr.dto;

/** [승인]·[반려] — action은 "confirm" | "reject", message는 결재의견·반려사유 (V02) */
public record AprApprConfirmReq(String action, String message) {
}
