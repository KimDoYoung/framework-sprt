package kr.co.kfs.asseterp.biz.sys.dto;

/** A09 회사·메뉴 연결 한 건 (AS-IS sys01_company.getInfoByMenuId의 companyMenuModel). 연결이 없으면 companyMenuId null */
public record CompanyMenuLinkRow(Long companyId, Long companyMenuId, String useYn) {
}
