package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 내 법인서류 및 날인신청 한 행 (AS-IS apr16_stamp_doc.selectByApplEmpId → Apr16_StampDocModel). stampOutYn은 'true'/'false' 글자 */
public record AprStampApplRes(Long stampDocId, LocalDate applDate, Long applEmpId, String applEmpName, String applType, String applTypeName,
                              Long stampId, String stampName, Long reprCorpId, String reprCorpName, String stampReprCorpName,
                              Long applQty, String stampOutYn, String provideCo, String purpose, String requester, String note,
                              LocalDate regDate, LocalDate stampDate, Long apprId, String apprName, String apprStatusName) {
}
