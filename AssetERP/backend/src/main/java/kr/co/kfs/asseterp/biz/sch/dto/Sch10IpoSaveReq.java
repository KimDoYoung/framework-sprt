package kr.co.kfs.asseterp.biz.sch.dto;

/** 공모주 일정 저장 (Sch10_Tab_IpoAdmin.update). ipoId가 없거나 0 이하면 새 행 */
public record Sch10IpoSaveReq(Long ipoId, String marketCode, String itemName, String issCorpCode,
                              String demandStartDate, String demandCloseDate, String subscriptionStartDate, String subscriptionCloseDate,
                              String payDate, String listDate, String priceBracket, Long price, String note, String cancelYn) {
}
