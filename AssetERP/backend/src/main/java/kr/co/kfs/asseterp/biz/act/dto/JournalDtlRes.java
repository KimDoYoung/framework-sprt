package kr.co.kfs.asseterp.biz.act.dto;

/** 계좌별 입·출금 분개 한 행(Act02_Tab_DepositIoList 입금·출금 그리드) — Act03_JournalDtlModel 중 거래유형·거래처·적요·금액 */
public record JournalDtlRes(String trName, String corpName, String note, Double drForAmt, Double crForAmt) {
}
