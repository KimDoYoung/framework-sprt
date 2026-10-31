package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/**
 * 법인카드(A41) 상신 기록 (AS-IS Biz01_Tab_Card.updateApprId → biz.Biz05_RelateAppr.insertPersonId + 상신 문서 첨부 엑셀 createCardExcel2).
 * startDate·closeDate·searchText는 엑셀에 담을 내역의 조건(원본 printModel — 검색어는 "%…%" 로 감싸기 전 글자)
 */
public record BizRelateApprPersonReq(String dataYm, Long apprId, String linkCode, LocalDate startDate, LocalDate closeDate, String searchText) {
}
