package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** 사원별 권한그룹 조회 조건 (AS-IS sys04_role.selectByUserId) */
public record RoleUserSearchParam(Long companyId, Long userId) {
}
