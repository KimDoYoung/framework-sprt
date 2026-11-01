package kr.co.kfs.asseterp.biz.ast.dto;

/** 비품대장 구분별 취득금액 합계 — 상신(A65) 본문 표의 한 줄 (ast13_book_depn.selectOfficeAssetsGroup) */
public record OfficeAssetGroupRes(Long bookDepnId, String itemType, Long purAmt) {
}
