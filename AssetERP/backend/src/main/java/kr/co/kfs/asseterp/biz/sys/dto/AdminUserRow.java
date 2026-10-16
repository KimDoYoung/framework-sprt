package kr.co.kfs.asseterp.biz.sys.dto;

/** sys02_user INSERT/UPDATE 값 */
public record AdminUserRow(Long userId, Long companyId, String korNm, String loginId, String decPasswd,
                           String email, String tel1, String tel2, String note, String adminYn) {
}
