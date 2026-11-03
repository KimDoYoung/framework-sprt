package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDate;

/** Scm01_Edit_DevMng.updateRow — 화면이 바꾸는 열(처리상태·완료예정일·시작일·완료일·개발난이도·예상기간·개발내용요약·개발대상·처리내용) */
public record SrDevMngSaveReq(String srStatusCd, LocalDate dueDate, LocalDate startDate, LocalDate closeDate, String devImportanceCd,
                              String expectPeriod, String devContent, String devTarget, String devTargetEtc, String resultContent) {
}
