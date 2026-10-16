package kr.co.kfs.asseterp.biz.sys.dto;

/** 권한그룹별 사원 저장 행. userRoleId가 0 이하(화면의 임시 행)면 등록, 아니면 수정 */
public record UserRoleSaveReq(
        Long userRoleId,
        Long userId,
        Long roleId,
        Long authOrgId
) {
}
