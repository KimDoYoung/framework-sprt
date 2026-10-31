package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 책무기술서(A91) 제목·본문 재료 (Tdm31_RoleDescModel의 임원·직책 이름과 책무배분기준일) */
public record TdmLinkRoleDescRow(Long personId, LocalDate allcStdDate, String personName, String roleName) {
}
