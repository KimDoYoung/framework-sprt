package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 권한그룹·메뉴권한 복사 SQL 파라미터 (AS-IS 파라미터 Map: inCompanyId → sourceCompanyId) */
public record RoleCopyParam(Long sourceCompanyId, Long companyId, String roleNm, Long menuId) {
}
