package kr.co.kfs.asseterp.biz.flt.dto;

/** J02 Flt10_Tab_PreApprove 그리드 한 줄(AS-IS Flt10_TrModel 중 매수·매도 그리드가 쓰는 열). 날짜는 'yyyy-MM-dd', 협의승인일시는 'yyyy-MM-dd HH:mm:ss' */
public record PreApproveRes(Long trId, Long personId, String personName, String regDate, String expectTrDate,
                            String itemTypeName, String itemName, Double expectTrQty, Long expectTrAmt,
                            Long yearInvestLimitEmp, String yearInvestLimitStr, String totalInvestAmtStr, String turnoverRateStr,
                            String bookDays, String checkBuyLockup, String checkFundHold,
                            String statusCode, String statusName, String trReason, String rejectReason,
                            Long addConfirmerId, String addConfirmerName, String addStatusName, String addConfirmDatetime,
                            String addConfirmReason, Boolean confirmSmsYn) {
}
