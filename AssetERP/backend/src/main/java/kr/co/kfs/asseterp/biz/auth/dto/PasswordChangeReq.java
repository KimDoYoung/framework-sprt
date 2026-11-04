package kr.co.kfs.asseterp.biz.auth.dto;

/**
 * 비밀번호 변경 요청 (AS-IS Sys25_Lookup_Password [확인] / [3개월 후 변경]).
 * currentPassword: 현재 비밀번호(인증번호로 확인된 재설정이거나 비밀번호가 비어 있는 계정이면 생략 가능)
 */
public record PasswordChangeReq(String companyCode, String loginId, String currentPassword, String newPassword) {
}
