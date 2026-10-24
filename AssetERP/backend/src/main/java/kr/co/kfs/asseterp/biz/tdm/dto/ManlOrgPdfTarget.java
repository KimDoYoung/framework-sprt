package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무매뉴얼 PDF를 만들 부서 책무매뉴얼 (AS-IS createRd가 쓰는 Tdm42_ManlOrgModel 속성). startDate는 yyyyMMdd, locName은 회사 폴더 이름(sys01_loc_nm) */
public record ManlOrgPdfTarget(Long manlOrgId, Long companyId, Long exctId, String startDate, String roleName, String exctName, String locName) {
}
