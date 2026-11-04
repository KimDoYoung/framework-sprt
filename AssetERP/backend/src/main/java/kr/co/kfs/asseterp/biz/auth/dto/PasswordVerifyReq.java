package kr.co.kfs.asseterp.biz.auth.dto;

/** 인증번호 확인 요청 (AS-IS Sys25_Lookup_Reset [비밀번호 변경]) */
public record PasswordVerifyReq(String companyCode, String empNo, String code) {
}
