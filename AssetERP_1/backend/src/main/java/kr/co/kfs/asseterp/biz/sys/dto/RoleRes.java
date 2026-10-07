package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 권한그룹 (AS-IS Sys04_RoleModel, sys04_role.mapper). 화면은 roleNm·seq·note를 편집한다.
 * defaultRole·adminYn은 DB 값('true'/'false' 문자열) 그대로 — 저장 전 기본권한 개수 검사(AS-IS update())에 쓴다.
 */
public record RoleRes(
        Long roleId,
        Long companyId,
        String roleNm,
        String seq,
        String note,
        String defaultRole,
        String adminYn,
        String companyNm
) {
}
