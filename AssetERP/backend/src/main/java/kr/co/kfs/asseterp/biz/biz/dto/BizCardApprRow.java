package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDateTime;

/**
 * A13 법인카드 내역관리 상신의 내역 한 건 (AS-IS biz01_promo.selectCardManagement — Biz01_PromoModel 중 상신 본문·첨부 엑셀에 쓰는 열, V38).
 * approvalAmount = 카드 승인금액(crd02), provideAmt = 제공금액, fileCountStr = 증빙 건수 글자("3건")
 */
public record BizCardApprRow(Long promoId, Boolean closeYn, String htmlCardName, String regEmpName, LocalDateTime approvalDt, String franchiseName,
                             String sectorName, Long provideAmt, Long approvalAmount, String providePurName, String provideContentName,
                             String accountCode, String accountName, String taxTypeName, String fileCountStr, String note) {
}
