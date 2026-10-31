package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** AS-IS biz05_relate_appr.selectByPromoIdList — 법인카드 내역이 이미 걸린 결재문서 (A13 연관문서 자동등록, V38) */
public record BizPromoRelateApprRow(Long apprId, String title, LocalDate regDate, String inoutCode) {
}
