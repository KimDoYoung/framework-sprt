package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 권한그룹별 사원 조회 조건 (AS-IS sys05_user_role.selectByRoleId / selectById)
 *
 * @param companyId  로그인 회사 — 조직(getOrg) 기준 회사
 * @param roleId     권한그룹 (목록 조회)
 * @param userRoleId 단건 조회
 */
public record UserRoleSearchParam(Long companyId, Long roleId, Long userRoleId) {
}
