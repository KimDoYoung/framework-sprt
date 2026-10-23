package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDateTime;

/** 법인카드 사용내역 조회(Biz01_Tab_CardContents) 한 행 — 그리드 12열과 편집 칸(Biz01_Edit_Card)에 쓰는 열 */
public record BizCardContentsRes(Long promoId, Boolean closeYn, String closeName, String htmlCardName, String regEmpName,
                                 LocalDateTime approvalDt, String franchiseName, String sectorName, Long approvalAmount,
                                 String providePurCode, String providePurName, String provideContentCode, String provideContentName,
                                 Long accountCodeId, String accountName, Long totalPeple, Long averagePrice, String note) {
}
