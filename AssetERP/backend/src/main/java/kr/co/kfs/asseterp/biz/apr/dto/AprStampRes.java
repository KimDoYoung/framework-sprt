package kr.co.kfs.asseterp.biz.apr.dto;

/** 인감 한 행 (AS-IS Apr10_StampModel — Apr10_Lookup_DocStamp 그리드). stampIdString은 이미지 URL용 문자열 ID */
public record AprStampRes(Long stampId, String stampIdString, String stampName, String useName, String orgName) {
}
