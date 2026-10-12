package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/**
 * 권한그룹별 메뉴권한 복사 요청 (AS-IS Sys07_Tab_Company.updateRole / updateMenu 의 ServiceRequest).
 * inCompanyId = 출발지(상단) 회사, roleName = 출발지에서 고른 권한명, menuId = 고른 메뉴(매뉴권한복사만), companyIds = 목적지(하단) 체크 회사
 */
public record RoleMenuCopyReq(Long inCompanyId, String roleName, Long menuId, List<Long> companyIds) {
}
