package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 법인서류 연결문서 한 줄 (AS-IS Apr18_RelateCorpDocModel — apr18_relate_corp_doc.selectByCorpDocId, EE93·EE94). title·statusName = 굵은 글씨 HTML 포함 */
public record AprCorpDocRelateRes(Long relateCorpDocId, Long corpDocId, Long apprId, String title, LocalDate regDate, LocalDate effectDate,
                                  String regEmpName, String statusName) {
}
