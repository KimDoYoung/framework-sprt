package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 급여 비고 한 행(Pay09_Lookup_Note) — noteType 1 전체비고 / 2 개별비고(사원별) */
public record PayRelateNoteRes(Long relateNoteId, Long companyId, LocalDate payDate, String payCd, String noteType,
                               Long personId, String note, String noteTypeNm, String personNm) {
}
