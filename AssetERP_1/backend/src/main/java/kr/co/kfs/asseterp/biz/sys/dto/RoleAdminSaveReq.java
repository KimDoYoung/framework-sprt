package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 고객사 권한그룹 저장 행 (A02 Sys04_Tab_RoleAdmin). roleId가 0 이하(화면의 임시 행)면 등록, 아니면 수정.
 * defaultRole·adminYn은 그리드 체크박스 값('true'/'false' 문자열, 새 행은 null)
 */
public record RoleAdminSaveReq(
        Long roleId,
        String roleNm,
        String seq,
        String note,
        String defaultRole,
        String adminYn
) {
}
