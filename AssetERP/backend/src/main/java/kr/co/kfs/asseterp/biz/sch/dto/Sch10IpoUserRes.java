package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 공모주 일정조회 한 행 (AS-IS Sch10_IpoModel, sch10_ipo.selectBySearchText): 관심 ★·청약률·일정공유(첫 공유자 외 n)를 더한 모양 */
public record Sch10IpoUserRes(Long ipoId, String interestName, String marketName, String itemName,
                              LocalDate demandStartDate, LocalDate demandCloseDate, LocalDate subscriptionStartDate, LocalDate subscriptionCloseDate,
                              LocalDate payDate, LocalDate listDate, String priceBracket, Long price, String note,
                              Double subscriptionRate, String shareInfo) {
}
