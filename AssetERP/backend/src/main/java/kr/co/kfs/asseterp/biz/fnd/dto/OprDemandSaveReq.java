package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/**
 * 수요예측 등록·수정 (AS-IS Fnd30_Edit_DemandOpr.update → fnd.Fnd30_Opr.modelUpdate · multiUpdate).
 * insertCount·payDate는 신규일 때만 쓴다(insertCount가 1보다 크면 같은 내용을 건수만큼 등록, payDate는 공모주 일정조회가 넘기는 납입일자 — 창에는 없다), cancelYn은 수정 창에만 있다
 */
public record OprDemandSaveReq(LocalDate demandDate, String itemName, String leadManager, String demandPeriod, String market,
                               String priceBracket, Long price, Boolean priceAcceptYn, String lockPeriod, String note,
                               Boolean cancelYn, Integer insertCount, LocalDate payDate) {
}
