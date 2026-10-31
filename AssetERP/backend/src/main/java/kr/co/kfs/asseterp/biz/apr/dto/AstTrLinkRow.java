package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 세금/4대보험 등록 한 행의 상신 본문 값 (AS-IS Ast06_Tab_TrTax 그리드에서 넘기던 Ast06_TrModel — A68 지출결의서, V33) */
public record AstTrLinkRow(Long trId, LocalDate date, Long amt, String note, String insureAccountName,
                           String npEtcNote, String hiEtcNote, String eiEtcNote, String ohEtcNote) {
}
