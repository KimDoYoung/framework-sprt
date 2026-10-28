package kr.co.kfs.asseterp.biz.pay.dto;

/** 전년도분 보수총액 저장 한 행 — AS-IS pay31_insure_apply.updateModel(보수총액 3칸·근무개월수) */
public record PayInsurePreYearRowReq(
        Long insureApplyId,
        Long preYearPay1,
        Long preYearPay2,
        Long preYearPay3,
        Long preYearWorkMonthCnt
) {
}
