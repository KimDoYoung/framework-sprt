package kr.co.kfs.asseterp.biz.apr.dto;

/** 연관법규 한 건의 법규·원인문서 (AS-IS apr.Apr20_RelateIcs.selectById의 법규ID·상신문서ID + apr.Apr01_Appr.selectById의 제목) — 법규정보 창(Sch04_Lookup_IcsList) */
public record AprRelateIcsOriginRes(Long classTreeId, Long apprId, String apprTitle) {
}
