package kr.co.kfs.asseterp.biz.sys.dto;

/** 권한그룹별 사원 (AS-IS Sys05_UserRoleModel — 그리드가 쓰는 값만) */
public record UserRoleRes(
        Long userRoleId,
        Long userId,
        Long roleId,
        Long authOrgId,
        String authOrgNm,
        String orgNm,
        String titleNm,
        String empNo,
        String korNm,
        String parentFullNm
) {
}
