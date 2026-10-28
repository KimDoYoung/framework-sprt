package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 갑근세원천징수확인서 저장 한 행 — incomeTaxWithholdingId가 0 이하이거나 DB에 없으면 등록 */
public record PayTaxWithholdingSaveReq(
        Long incomeTaxWithholdingId,
        Long personId,
        LocalDate regDate,
        String stdYear,
        String purUseCode,
        String submitTo,
        Long cnt
) {
}
