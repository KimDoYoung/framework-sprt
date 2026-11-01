package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 지출요청의 증빙문서 한 행 (AS-IS com01_relate_appr.selectByKeyTableId) */
public record ExpenseRelateApprRes(Long relateApprId, Long apprId, LocalDate regDate, LocalDate effectDate, String title, String regEmpName, String statusName) {
}
