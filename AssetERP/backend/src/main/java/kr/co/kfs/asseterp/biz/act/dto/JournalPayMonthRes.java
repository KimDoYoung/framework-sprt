package kr.co.kfs.asseterp.biz.act.dto;

/** 급여 전표 한 행(Pay10_Lookup_Journal) — 차변·대변 계정코드·계정과목·금액·관리계좌 */
public record JournalPayMonthRes(Long journalDtlId, String drAccountCode, String drAccountName, Long drAmt, String drAstName,
                                 String crAccountCode, String crAccountName, Long crAmt, String crAstName) {
}
