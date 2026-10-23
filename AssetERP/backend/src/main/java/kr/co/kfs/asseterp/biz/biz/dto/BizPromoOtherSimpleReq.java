package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** Biz01_Edit_OtherSimple [저장] — 구분·일자·목적·내역·경제적 가치·거래상대방·인원·비고 (AS-IS modelUpdate가 채우는 열) */
public record BizPromoOtherSimpleReq(String provideRcvType, LocalDate provideDate, String providePurCode, String provideContentCode,
                                     Long provideAmt, String provideCompany, Long pepleCount, String note) {
}
