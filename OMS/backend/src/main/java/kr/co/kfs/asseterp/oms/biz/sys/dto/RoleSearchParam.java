package kr.co.kfs.asseterp.oms.biz.sys.dto;

/**
 * 권한그룹 조회 조건 (AS-IS sys04_role.selectByName 파라미터 Map)
 *
 * @param companyId 로그인 회사
 * @param roleNm    권한명 LIKE 패턴 (%권한명%)
 */
public record RoleSearchParam(Long companyId, String roleNm) {

    public static RoleSearchParam of(Long companyId, String roleNm) {
        return new RoleSearchParam(companyId, "%" + (roleNm == null ? "" : roleNm.trim()) + "%");
    }
}
