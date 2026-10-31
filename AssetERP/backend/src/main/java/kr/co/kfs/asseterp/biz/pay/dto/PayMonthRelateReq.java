package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 급여대장 상신 행 만들기 (AS-IS pay.Pay05_RelateAppr.insert + utils.pdf.PDFCreate.createPayMonth10, V25) */
public record PayMonthRelateReq(String payCode, LocalDate payDate) {
}
