package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.util.List;

/**
 * 권한그룹·메뉴권한 복사 (AS-IS Sys07_RoleMenu.updateRole / updateMenu): sourceCompanyId 회사의 권한그룹(이름 기준)을 companyIds 회사로
 *
 * @param menuId 메뉴권한 복사일 때만. 이 메뉴와 상위 메뉴 전부를 복사한다
 */
public record RoleCopyReq(Long sourceCompanyId, String roleNm, Long menuId, List<Long> companyIds) {
}
