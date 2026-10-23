package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** Biz01_Edit_Other [저장] — 제공(수령)구분·일자·목적·내역·경제적 가치·비고 (AS-IS modelUpdate가 채우는 열) */
public record BizPromoOtherReq(
        String provideRcvType,
        LocalDate provideDate,
        String providePurCode,
        String provideContentCode,
        Long provideAmt,
        String note
) {
}
