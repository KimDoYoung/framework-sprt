package kr.co.kfs.asseterp.biz.est.dto;

import java.time.LocalDate;

/**
 * 용역계약 결재 문서(A60 용역수행 계획서 · A61 용역 결과보고서) 양식 치환에 쓰는 행 (AS-IS Est02_PfContractModel).
 * fileListHtml = 계약에 올린 첨부 파일명, fileListResultHtml = 수행내역 증빙 "(연번) 설명" 목록, 둘 다 `<br>`로 이은 글자.
 */
public record PfContractLinkRow(
        Long pfContractId, String borrower, String projectSiteName, String projectSiteAddr, String feeCode, String feeName,
        LocalDate startDate, LocalDate closeDate, String managerInfo, String plan, String fileListHtml, String fileListResultHtml) {
}
