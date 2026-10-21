package kr.co.kfs.asseterp.biz.flt.dto;

/** 매수제한종목 저장 행 (J09). buyLockupId ≤ 0이면 새 행 */
public record BuyLockupSaveReq(Long buyLockupId, String itemCode, String startDate, String closeDate, String lockupType) {
}
