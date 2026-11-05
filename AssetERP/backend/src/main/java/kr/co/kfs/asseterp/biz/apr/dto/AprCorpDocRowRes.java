package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 법인서류 한 줄 (AS-IS Apr17_CorpDocModel — selectByCorpRegDate·selectByAppDate·selectById, U2-02). apprCntStr = "n 건", stampDateYn = 날인일자가 있는 인감이 하나라도 있으면 true */
public record AprCorpDocRowRes(Long corpDocId, LocalDate callDate, LocalDate regDate,
                               Long stampCertIssueCnt, Long stampCertCallCnt, Long stampCertUseCnt,
                               Long corpRegIssueCnt, Long corpRegCallCnt, Long corpRegUseCnt,
                               String provideCo, String purpose, String requester, String note,
                               String callEmpName, String apprCntStr, Boolean stampDateYn) {
}
