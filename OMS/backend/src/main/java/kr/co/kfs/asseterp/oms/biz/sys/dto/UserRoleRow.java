package kr.co.kfs.asseterp.oms.biz.sys.dto;

/** sys05_user_role INSERT/UPDATE 파라미터. companyId는 로그인 회사 — 권한그룹(sys04)이 이 회사 것일 때만 수정·삭제된다 */
public record UserRoleRow(Long userRoleId, Long companyId, Long userId, Long roleId, String seq, String note, Long authOrgId) {
}
