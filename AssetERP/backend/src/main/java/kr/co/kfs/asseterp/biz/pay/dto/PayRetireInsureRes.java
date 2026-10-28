package kr.co.kfs.asseterp.biz.pay.dto;

/** 퇴직정산 4대보험(pay12_retire_insure) 한 행 — insureCode 2:건강 3:장기요양 4:고용 */
public record PayRetireInsureRes(Long retireInsureId, Long monthId, String insureCode, String year, String applyTerm,
                                 Long workMonthCnt, Long payMonthCnt, Long totalPay, Long monthPay, Double insureRate,
                                 Long monthAmt, Long fixAmt, Long payAmt, Long unpayAmt, Long settleAmt) {
}
