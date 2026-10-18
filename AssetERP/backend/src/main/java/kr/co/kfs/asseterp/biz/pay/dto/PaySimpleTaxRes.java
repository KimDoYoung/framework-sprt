package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 근로소득 간이세액표(pay22) 한 행 — 월급여액(천원) 이상·미만 × 공제대상가족수 1~11 */
public record PaySimpleTaxRes(Long simpleTaxTableId, LocalDate startDate, Long fromAmt, Long toAmt,
                              Long deductCnt1, Long deductCnt2, Long deductCnt3, Long deductCnt4, Long deductCnt5, Long deductCnt6,
                              Long deductCnt7, Long deductCnt8, Long deductCnt9, Long deductCnt10, Long deductCnt11) {
}
