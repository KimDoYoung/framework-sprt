package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 규약 내용 조회창(Fnd25_Lookup_Content) 한 행 — AS-IS Fnd26_TermsDetailModel 중 그리드 열과 본문 */
public record FundTermsDetailRes(Long termsDetailId, LocalDate revisionDate, Long revisionNo, Long fileCnt, String content) {
}
