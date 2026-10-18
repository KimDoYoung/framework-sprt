package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서구분에 연결된 내규 (AS-IS Dcr21_RelateIcrModel — Dcr21_Lookup_Icr 그리드) */
public record DcrRelateIcrRes(Long relateIcrId, Long dcrClassTreeId, Long icrClassTreeId, String classTreeFullName, String content,
                              String submitTo, String cycleName, String relatedLaw, String classTreeCode, String note) {
}
