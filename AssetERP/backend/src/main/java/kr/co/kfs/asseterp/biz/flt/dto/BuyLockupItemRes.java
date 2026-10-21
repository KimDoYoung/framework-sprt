package kr.co.kfs.asseterp.biz.flt.dto;

/** 매수제한종목 한 행 (AS-IS flt08_buy_lockup.selectByText·selectById, J09). 매수제한 검사 결과는 `BuyLockupRes` */
public record BuyLockupItemRes(Long buyLockupId, Long companyId, String itemCode, String itemName, String startDate,
                               String closeDate, String lockupType, String lockupTypeName) {
}
