package kr.co.kfs.asseterp.biz.apr.dto;

/**
 * 일일자금관리 출력 자료 한 줄 (AS-IS sys99_print.selectByDepositIoList → Sys99_PrintModel, V33).
 * 모델 속성 대응: string01 = accountName(계좌) · string02 = curCode(통화) · string04 = className(예금구분) ·
 * double01 = preDayAmt(기초잔액) · double02 = holdQty(마감잔액) · double19 = inAmt(입금 합) · double20 = outAmt(출금 합)
 */
public record DepositIoPrintRow(String curCode, String className, String accountName,
                                Double preDayAmt, Double holdQty, Double inAmt, Double outAmt) {
}
