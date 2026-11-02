package kr.co.kfs.asseterp.biz.bbs.dto;

/** 게시판 분류 권한 저장 한 줄 (AS-IS bbs.Bbs33_Role.update). roleId가 없거나 0 이하면 새 줄 */
public record ClassRoleSaveReq(Long roleId, String roleCd, Long personId, Long orgCodeId) {
}
