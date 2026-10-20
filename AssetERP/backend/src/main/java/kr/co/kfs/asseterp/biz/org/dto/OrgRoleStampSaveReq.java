package kr.co.kfs.asseterp.biz.org.dto;

/** 인감별 사용 가능 부서 저장 한 행 (AS-IS Org10_RoleStamp.update, G07). roleStampId가 없거나 0 이하면 새 행 */
public record OrgRoleStampSaveReq(Long roleStampId, Long stampId, Long orgCodeId, String useYn) {
}
