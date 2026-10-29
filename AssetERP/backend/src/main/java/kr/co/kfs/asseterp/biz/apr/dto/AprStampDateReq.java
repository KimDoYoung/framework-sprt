package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 날인일자 수정(AS-IS Apr16_StampDoc.updateStampDate) — stampDate가 null이면 날인일자를 비운다 */
public record AprStampDateReq(Long stampDocId, LocalDate stampDate) {
}
