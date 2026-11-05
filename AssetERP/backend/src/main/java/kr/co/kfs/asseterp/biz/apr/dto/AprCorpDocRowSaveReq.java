package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 법인서류 저장 요청 한 줄 (AS-IS apr.Apr17_CorpDoc.update·copyUpdate의 UpdateDataModel, U2-02). corpDocId가 0 이하이면 새 줄.
 *  법인서류 매수관리는 regDate·발급/신청/사용 매수·제공처…비고를, 신청 화면은 callDate·제공처…비고·신청매수만 쓴다 */
public record AprCorpDocRowSaveReq(Long corpDocId, LocalDate callDate, LocalDate regDate,
                                   Long stampCertIssueCnt, Long stampCertCallCnt, Long stampCertUseCnt,
                                   Long corpRegIssueCnt, Long corpRegCallCnt, Long corpRegUseCnt,
                                   String provideCo, String purpose, String requester, String note) {
}
