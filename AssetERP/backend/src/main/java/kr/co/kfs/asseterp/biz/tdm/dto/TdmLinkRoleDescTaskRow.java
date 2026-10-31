package kr.co.kfs.asseterp.biz.tdm.dto;

/** A91 본문 행 — AS-IS tdm30_role_allc.selectByPersonId (임원 이름, 겸직여부, 직책 이름, 책무 이름) */
public record TdmLinkRoleDescTaskRow(String personName, Boolean addTitleYn, Long roleId, String roleName, String taskName) {
}
