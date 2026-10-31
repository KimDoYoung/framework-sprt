package kr.co.kfs.asseterp.biz.apr.dto;

/** 4대보험 납부 고지 내역 한 줄 (AS-IS ast21_tr_4insure.selectExpenseAppr → Ast21_Tr4InsureModel, V33) */
public record Tr4InsureLinkRow(String typeName, String noticeMonth, Long empCnt, Long companyAmt, Long empAmt,
                               Long payAmt, Long etcAmt, Long realPayAmt) {
}
