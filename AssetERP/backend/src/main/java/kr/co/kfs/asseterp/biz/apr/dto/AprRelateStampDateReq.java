package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 날인일자 수정(AS-IS Apr19_Edit_StampDate.update → Apr19_RelateStamp.modelUpdate) — stampDate가 null이면 비운다 */
public record AprRelateStampDateReq(Long relateStampId, LocalDate stampDate) {
}
