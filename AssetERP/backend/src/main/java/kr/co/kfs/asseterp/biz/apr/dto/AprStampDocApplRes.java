package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 신청내역 가져오기 창(AS-IS selectApplDocByRegDateIsNull) */
public record AprStampDocApplRes(Long stampDocId, LocalDate applDate, String applEmpName, String provideCo, String purpose,
                                 String applType, String applTypeName, String stampReprCorpName, Long docApplQty) {
}
