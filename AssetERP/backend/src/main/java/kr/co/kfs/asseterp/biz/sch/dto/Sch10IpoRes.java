package kr.co.kfs.asseterp.biz.sch.dto;

/** 공모주 일정 (Sch10_Tab_IpoAdmin 그리드). 날짜는 yyyy-MM-dd, cancelYn은 'true'/'false' */
public record Sch10IpoRes(Long ipoId, Long companyId, String marketCode, String marketName, String itemName, String issCorpCode,
                          String demandStartDate, String demandCloseDate, String subscriptionStartDate, String subscriptionCloseDate,
                          String payDate, String listDate, String priceBracket, Long price, String note, String cancelYn,
                          Long shareCount) {
}
