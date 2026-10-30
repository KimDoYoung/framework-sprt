package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 접대비 제공 내역 한 줄 (AS-IS Biz01_PromoModel — selectByAccountName·selectByTargetCompanyName) */
public record BizEntertmHistoryRes(Long promoId, String regEmpName, LocalDate approvalDt, String franchiseName, Long provideAmt,
                                   Long averageProvideAmt, Long totalPeple, Long averagePrice, String note) {
}
