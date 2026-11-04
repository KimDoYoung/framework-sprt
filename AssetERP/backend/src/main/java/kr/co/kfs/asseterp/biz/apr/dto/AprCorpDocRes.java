package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 법인서류 신청내역 한 줄 (AS-IS Apr17_CorpDocModel — apr17_corp_doc.selectByCompanyId, EE92) */
public record AprCorpDocRes(Long corpDocId, LocalDate callDate, String callEmpName, String provideCo, String purpose,
                            Long stampCertCallCnt, Long corpRegCallCnt, LocalDate regDate) {
}
