package kr.co.kfs.asseterp.biz.apr.dto;

/** 법인서류 합계 한 줄 (AS-IS apr17_corp_doc.selectByRegDate — 법인인감증명서·법인등기부등본 발급/사용/잔여, U2-02) */
public record AprCorpDocTotalRes(Long id, String typeName, Long issueSum, Long useSum, Long remain) {
}
