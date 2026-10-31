package kr.co.kfs.asseterp.biz.tdm.dto;

/** A92 본문 행 — AS-IS tdm30_role_allc.selectByAllcStdDate (직책, 임원, 직위, 겸직여부) */
public record TdmLinkRoleDigmRow(String roleName, String personName, String posName, Boolean addTitleYn) {
}
