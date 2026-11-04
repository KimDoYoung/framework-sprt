package kr.co.kfs.asseterp.biz.auth.dto;

/** 인증번호 발송 요청 (AS-IS Sys25_Lookup_Reset [전송]) */
public record PasswordCodeReq(String companyCode, String empNo, String phone) {
}
