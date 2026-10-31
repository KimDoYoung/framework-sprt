package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 이행점검보고서(A94) 제목·본문 재료: 점검년월과 점검시작일 */
public record TdmLinkChckJobRow(String checkYm, LocalDate startDate) {
}
