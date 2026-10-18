package kr.co.kfs.asseterp.biz.org.dto;

/** 책무 대상 조직 한 행 (AS-IS Org00_OrgInfoModel 중 Org00_Lookup_SelectTdm 그리드·선택에 쓰는 속성) */
public record OrgTdmRes(Long orgCodeId, String orgCd, String korNm, String korNmWithSubOrg) {
}
