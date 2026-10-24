package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무기술서 등록 조회창(Tdm30_Lookup_SelectMulti) 한 행 — AS-IS tdm30_role_allc.selectPerson. 날짜는 yyyy-MM-dd */
public record RoleAllcPersonRes(Long roleAllcId, Long personId, String personName, String roleName, String addTitle, String allcStdDate) {
}
