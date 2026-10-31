package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무매뉴얼 보고(A93) 결재 문서의 제목·본문에 쓰는 부서·책무 이름 (AS-IS Tdm42_ManlOrgModel.orgName·roleName) */
public record ManlOrgLinkRow(String orgName, String roleName) {
}
