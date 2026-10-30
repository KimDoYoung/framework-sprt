package kr.co.kfs.asseterp.biz.apr.dto;

/**
 * 결재 처리 결과. ok가 false면 message를 안내로 보여 준다(AS-IS SimpleMessage). needConfirm이면 message를 확인 창으로 묻고 confirmed=true로 다시 보낸다.
 * makePdf는 결재가 끝나고 인감이 있어 AS-IS가 PDF를 만들던 경우(utils.pdf.PDFCreate.createPDF7) — V04 전까지 만들지 않는다. notice는 처리는 됐지만 알릴 말(완료된 날인신청 등)
 */
public record AprApprActionRes(boolean ok, boolean needConfirm, boolean makePdf, String message, String notice) {
}
