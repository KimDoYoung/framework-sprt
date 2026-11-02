package kr.co.kfs.asseterp.biz.bbs.dto;

/** 게시판 분류 권한 한 줄 (AS-IS Bbs33_RoleModel). roleCd 'P' = 사원, 'O' = 부서(조직) */
public record ClassRoleRes(Long roleId, Long classTreeId, String roleCd, Long personId, Long orgCodeId, String personName, String orgName, String roleName) {
}
