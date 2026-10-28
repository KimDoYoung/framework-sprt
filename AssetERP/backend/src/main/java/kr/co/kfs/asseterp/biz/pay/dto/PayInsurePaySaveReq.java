package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 4대보험 납부 저장 한 행 — insurePayId가 없으면 새 행 */
public record PayInsurePaySaveReq(Long insurePayId, Long personId, String year, String insureCd, Long tgtAmt, String payCd,
                                  Long payDiv, LocalDate date, Long cnt, Long amt, Long remAmt) {
}
