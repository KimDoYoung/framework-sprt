package kr.co.kfs.asseterp.oms.biz.org.dto;

/** 기준일 조직 (AS-IS org00_org_info → Org00_OrgInfoModel 중 화면에 쓰는 컬럼) */
public record OrgInfoRes(Long orgCodeId, String orgCd, String korNm, Long parentCodeId, String parentFullNm, String levelCd) {
}
