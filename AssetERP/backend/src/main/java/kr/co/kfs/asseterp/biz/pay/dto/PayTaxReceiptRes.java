package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 원천징수영수증 파일 한 건 (S24) — AS-IS Pay08_TaxWithholdingModel (영수증 행 + 첨부파일 sys10_file) */
public record PayTaxReceiptRes(
        Long taxWithholdingId,
        Long personId,
        String personName,
        LocalDate regDate,
        String note,
        Long fileId,
        String fileName,
        String fileExt
) {
}
