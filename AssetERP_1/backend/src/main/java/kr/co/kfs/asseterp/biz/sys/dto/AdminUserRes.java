package kr.co.kfs.asseterp.biz.sys.dto;

/** 고객별 관리자 (AS-IS Sys02_UserModel ← sys02_user.selectByName). 암호화된 sys02_passwd는 내보내지 않는다(화면은 decPasswd만 쓴다) */
public record AdminUserRes(Long userId, Long companyId, String korNm, String loginId, String decPasswd,
                           String email, String tel1, String tel2, String note, String adminYn) {
}
