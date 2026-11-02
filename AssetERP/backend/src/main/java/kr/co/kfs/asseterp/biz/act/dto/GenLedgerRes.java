package kr.co.kfs.asseterp.biz.act.dto;

/** 계정원장 한 줄 (act04_gen_ledger.selectByStdDate1·2 / selectByAccountCode, X18). level·parentCode는 하위계정 트리(selectByAccountCode)에만 있다 */
public record GenLedgerRes(Long genLedgerId, String accountCode, String accountName, String accountName2,
                           Long drTodayBalAmt, Long drTodayDiffAmt, Long drPredayBalAmt,
                           Long crTodayBalAmt, Long crTodayDiffAmt, Long crPredayBalAmt,
                           Long todayBalAmt, String slipYn, Long level, String parentCode) {
}
