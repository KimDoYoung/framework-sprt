package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz14_relate_appr.selectByContHistoryId — 연관문서 */
public record BizContRelateApprRes(Long relateApprId, Long apprId, Long contHistoryId, LocalDate regDate, LocalDate effectDate,
                                   String title, String regEmpNm, String statusNm) {
}
