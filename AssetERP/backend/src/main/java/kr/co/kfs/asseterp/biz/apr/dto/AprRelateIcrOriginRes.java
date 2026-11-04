package kr.co.kfs.asseterp.biz.apr.dto;

/** 연관내규 한 건의 내규·원인문서 (AS-IS apr.Apr22_RelateIcr.selectById의 내규ID·상신문서ID + apr.Apr01_Appr.selectById의 제목) — 내규정보 창(Sch04_Lookup_IcrList) */
public record AprRelateIcrOriginRes(Long classTreeId, Long apprId, String apprTitle) {
}
