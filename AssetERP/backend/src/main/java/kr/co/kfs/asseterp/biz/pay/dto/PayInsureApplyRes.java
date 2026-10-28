package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 4대보험 신고 한 행 — AS-IS Pay31_InsureApplyModel (S26). 날짜는 yyyy-MM-dd */
public record PayInsureApplyRes(
        Long insureApplyId,
        Long companyId,
        Long personId,
        String insureCode,
        String insureApplyCode,
        LocalDate applyDate,
        LocalDate initDate,
        String applyMonth,
        Long applyMonthPay,
        Long preYearWorkMonthCnt,
        Long preYearPay1,
        Long preYearPay2,
        Long preYearPay3,
        String termInfo,
        String payCode,
        Long payDiv,
        String note,
        Boolean npsInitPayYn,
        String personNo,
        String personName,
        String insureName,
        String insureApplyName,
        String payName,
        Long insureYearPay
) {
}
