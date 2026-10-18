package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서구분에 연결된 법규 (AS-IS Dcr20_RelateIcsModel — Dcr20_Lookup_Ics 그리드) */
public record DcrRelateIcsRes(Long relateIcsId, Long dcrClassTreeId, Long icsClassTreeId, String classTreeFullName, String content,
                              String submitTo, String cycleName, String relatedLaw, String classTreeCode, String note) {
}
