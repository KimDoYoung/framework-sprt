package kr.co.kfs.asseterp.biz.sys.dto;

/** 문서권한 저장 한 행 (specificMenuLinkId가 null/0 이하면 신규) */
public record SpecificMenuLinkSaveReq(Long specificMenuLinkId, String specificWorkCd, String linkCd, String note) {
}
