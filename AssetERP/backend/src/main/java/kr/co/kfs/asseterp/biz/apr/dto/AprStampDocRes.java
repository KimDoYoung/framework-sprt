package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 법인서류 매수관리 그리드(AS-IS Apr16_StampDocModel — selectDocByRegDate). 논리 값 없음 */
public record AprStampDocRes(Long stampDocId, Long companyId, LocalDate regDate, String applType, String applTypeName,
                             Long stampId, Long reprCorpId, String stampReprCorpName,
                             Long docIssueQty, Long docApplQty, Long docUseQty,
                             String provideCo, String purpose, String requester, String note,
                             LocalDate applDate, String applEmpName, Long apprId, String apprName, String apprStatusName) {
}
