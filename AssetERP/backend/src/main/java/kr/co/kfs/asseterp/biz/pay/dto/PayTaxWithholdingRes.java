package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 갑근세원천징수확인서 발급 한 행 (S23) — AS-IS Pay40_IncomeTaxWithholdingModel */
public record PayTaxWithholdingRes(
        Long incomeTaxWithholdingId,
        Long personId,
        String personName,
        LocalDate regDate,
        String stdYear,
        String purUseCode,
        String purUseName,
        String submitTo,
        Long cnt,
        Long issueNo,
        Long apprId,
        String statusCode,
        String statusName
) {
}
