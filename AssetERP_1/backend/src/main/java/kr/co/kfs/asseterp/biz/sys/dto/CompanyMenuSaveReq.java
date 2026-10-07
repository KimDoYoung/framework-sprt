package kr.co.kfs.asseterp.biz.sys.dto;

/** 회사별 메뉴맵핑 저장 행 (companyMenuId가 없으면 신규) */
public record CompanyMenuSaveReq(Long menuId, Long companyMenuId, String useYn) {
}
