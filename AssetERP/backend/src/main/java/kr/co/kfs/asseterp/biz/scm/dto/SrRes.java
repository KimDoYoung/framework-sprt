package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDate;

/** 시스템 개발의뢰(SR) 한 줄 (scm01_sr.selectByText·selectById, EE15) — 목록 그리드와 아래 폼이 같이 쓴다 */
public record SrRes(Long srId, String systemCd, LocalDate srDate, Long personId, Long corpId, String requestor, String srType,
                    String srContent, String apprStatusCd, String srStatusCd, LocalDate startDate, LocalDate dueDate, LocalDate closeDate,
                    String resultContent, String devImportanceCd, String expectPeriod, String devContent, String devTarget,
                    String devTargetEtc, String srNo, String srArrangeContent, String personNm, String corpNm, String systemNm,
                    String srTypeNm, String apprStatusNm, String srStatusNm, String devImportanceNm, Long fileCount,
                    String requestorCorpNm, String devCountStr) {
}
