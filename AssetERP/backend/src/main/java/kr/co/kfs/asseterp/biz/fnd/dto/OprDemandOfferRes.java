package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 청약 등록 대상 수요예측 한 건 — AS-IS Fnd30_OprModel (fnd30_opr.selectByDemandOprCode, 결재완료·청약 미진행). schPayDate는 공모주 일정의 납입일 */
public record OprDemandOfferRes(Long oprId, LocalDate demandDate, String itemName, String market, String leadManager, Long price,
                                String lockPeriod, String apprStatusCode, LocalDate schPayDate, String note) {
}
