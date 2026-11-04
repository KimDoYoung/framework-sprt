package kr.co.kfs.asseterp.biz.pay.dto;

/** 퇴직정산서 생성 요청 (AS-IS Pay07_Lookup_RetireCreate → pay07_retire_create) — 빈 금액은 0 */
public record PayRetireStatementCreateReq(Long personId, Long calcMonth, Long fixHi, Long fixLt, Long fixEi,
                                          boolean nonHiYn, boolean nonLtYn, boolean nonEiYn) {
}
