package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검항목 생성 대상 부서 책무매뉴얼 (AS-IS tdm42_manl_org.selectByStdDate 중 쓰는 속성) */
public record ManlOrgForCheckRes(Long manlOrgId, Long roleId, Long exctId, Long orgId) {
}
