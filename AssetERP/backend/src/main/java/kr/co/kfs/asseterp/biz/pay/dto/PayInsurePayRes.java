package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 4대보험 연말정산 납부 한 행(Pay32_Lookup_Detail — 일자 · 정산보험료 · 납부방법 · 분할납부회차 · 납부회차 · 납부금액 · 잔여금액) */
public record PayInsurePayRes(Long insurePayId, Long companyId, Long personId, String year, String insureCd, Long tgtAmt,
                              String payCd, Long payDiv, LocalDate date, Long cnt, Long amt, Long remAmt,
                              String personNo, String personNm, String insureNm, String payNm) {
}
