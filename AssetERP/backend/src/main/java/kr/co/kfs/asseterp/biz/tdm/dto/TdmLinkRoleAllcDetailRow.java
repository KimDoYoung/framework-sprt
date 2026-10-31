package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 임원책무동의서(A90) 제목·본문 재료: 책무배분 상세의 직책·책무배분일과 임원·직책 이름 (AS-IS tdm30_role_allc.selectById의 이름 열 + tdm34 책무배분일) */
public record TdmLinkRoleAllcDetailRow(Long roleId, LocalDate roleAllcDate, String personName, String roleName) {
}
