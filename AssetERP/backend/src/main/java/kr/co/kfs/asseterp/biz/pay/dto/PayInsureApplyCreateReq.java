package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 자격취득·보수변동/착오정정 등록 창의 [생성] — AS-IS pay.Pay31_InsureApply.insert1 */
public record PayInsureApplyCreateReq(
        Long personId,
        boolean ch01,
        boolean ch02,
        boolean ch03,
        Boolean npsInitPayYn,
        String insureApplyCode,
        LocalDate applyDate,
        LocalDate initDate,
        Long applyMonthPay,
        String applyMonth
) {
}
