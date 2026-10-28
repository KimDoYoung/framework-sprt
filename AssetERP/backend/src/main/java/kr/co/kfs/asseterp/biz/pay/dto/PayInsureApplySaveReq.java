package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 4대보험 신고 저장 한 행(탭 1·2·4) — insureApplyId가 0 이하이거나 DB에 없으면 등록(탭 4 [등록]) */
public record PayInsureApplySaveReq(
        Long insureApplyId,
        Long personId,
        String insureCode,
        String insureApplyCode,
        LocalDate applyDate,
        LocalDate initDate,
        String applyMonth,
        Long applyMonthPay,
        String payCode,
        Long payDiv,
        String note,
        Boolean npsInitPayYn
) {
}
