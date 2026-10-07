package kr.co.kfs.asseterp.biz.sys.dto;

/** 고객별 관리자 저장 행 (ID ≤ 0이면 신규). decPasswd가 있으면 to_encrypts로 저장 */
public record AdminUserReq(Long userId, String korNm, String loginId, String decPasswd,
                           String email, String tel1, String tel2, String note, String adminYn) {
}
