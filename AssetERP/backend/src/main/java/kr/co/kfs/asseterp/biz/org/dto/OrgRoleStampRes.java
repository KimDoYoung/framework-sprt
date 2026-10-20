package kr.co.kfs.asseterp.biz.org.dto;

/** 인감별 사용 가능 부서 한 행 (AS-IS Org10_RoleStampModel — Org10_Lookup_RoleStamp 그리드, G07). orgName은 조회 시점의 부서명 */
public record OrgRoleStampRes(Long roleStampId, Long stampId, Long orgCodeId, String orgName, String useYn) {
}
