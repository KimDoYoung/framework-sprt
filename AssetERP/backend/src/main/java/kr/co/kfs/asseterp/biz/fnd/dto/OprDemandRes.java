package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/**
 * 수요예측 한 건 — AS-IS Fnd30_OprModel (fnd30_opr.selectByDemandDate · selectById). 결재문서가 없으면 apprId·apprStatusCode는 null.
 * priceAcceptYn·cancelYn은 varchar 'true'/'false'를 Boolean으로(null은 false)
 */
public record OprDemandRes(Long oprId, String oprCode, LocalDate demandDate, String itemName, String market, String leadManager,
                           String demandPeriod, String priceBracket, Long price, Boolean priceAcceptYn, String priceAcceptStr,
                           String lockPeriod, Long apprId, String apprStatusCode, String apprStatusName, Boolean cancelYn,
                           String cancelName, String note) {
}
